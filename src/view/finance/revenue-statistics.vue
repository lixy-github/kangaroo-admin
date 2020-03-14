<template>
    <div>
        <ul class="top-nav">
            <li @click="toggleNav(1)" :class="{'active': navIndex == 1}">
                <p class="num red">123</p>
                昨日销售额（元）
            </li>
            <!-- <li @click="toggleNav(2)" :class="{'active': navIndex == 2}">
                <p class="num red">456</p>
                昨日利润（元）
            </li> -->
            <li @click="toggleNav(3)" :class="{'active': navIndex == 3}">
                <p class="num red">65756</p>
                代理昨日销售额（元）
            </li>
        </ul>

        <Card :dis-hover="true">
            <div class="data-card">
                <div>
                    <Form ref="searchForm" :model="searchForm" inline :label-width="60">
                        <!-- <FormItem :label-width="0">
                            <Select v-model="searchForm.searchYear" filterable placeholder="请选择年份" style="display:inline-block; width:100px; margin-right:20px;">
                                <Option v-for="(item, index) in yearArr" :value="item" :key="index">{{ item + "年" }}</Option>
                            </Select>
                            <Select v-model="searchForm.searchMonth" filterable clearable placeholder="请选择月份" style="display:inline-block; width:100px;">
                                <Option v-for="(item, index) in 12" :value="item" :key="index">{{ item + "月" }}</Option>
                            </Select>
                        </FormItem> -->

                        <FormItem label="年" :label-width="20">
                            <DatePicker type="year" v-model="searchForm.searchYear" :clearable="false" :editable="false" style="width: 100px" @on-change="changeYear"></DatePicker>
                        </FormItem>
                        <FormItem label="月" class="not-events" :label-width="20">
                            <DatePicker type="month" v-model="searchForm.searchMonth" format="MM" style="width: 100px" @on-change="changeMonth" :disabled="monthDisabled"></DatePicker>
                        </FormItem>
                        <template v-if="navIndex == 3">
                            <FormItem label="日" class="not-events" :label-width="20">
                                <DatePicker type="date" v-model="searchForm.searchDay" format="dd" style="width: 100px" @on-change="changeDay" :disabled="dayDisabled"></DatePicker>
                            </FormItem>
                            <FormItem label="ID" :label-width="20" style="width:100px;">
                                <Input v-model="searchForm.id" />
                            </FormItem>
                            <FormItem label="手机号" style="width:150px;">
                                <Input v-model="searchForm.phone" />
                            </FormItem>
                            <FormItem label="代理类型" style="width:150px;">
                                <Select v-model="searchForm.type">
                                    <Option value="1">省级代理</Option>
                                    <Option value="2">市级代理</Option>
                                </Select>
                            </FormItem>
                        </template>
                        <FormItem label="" :label-width="10">
                            <Button type="primary" @click="searchBtn">搜索</Button>
                        </FormItem>
                    </Form>
                </div>
                <p>{{ titleName }} :
                    <span class="red">1234434</span>
                </p>
            </div>

            <Table :columns="columns" :data="tableData" size="small" stripe style="margin-top:20px;"></Table>

            <div style="margin:20px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="page.total" :current="page.current" @on-change="changePage" :page-size="page.size"></Page>
                </div>
            </div>
        </Card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            navIndex: 1,
            yearArr: [],
            searchForm: {
                searchYear: new Date(),
                searchMonth: new Date(),
                searchDay: new Date(new Date().getTime() - (24*60*60*1000)),
                id: "",
                phone: "",
                type: ""
            },
            tableData: [],
            columnIndexTitle: "年",
            page: {
                current: 1,
                size: 15,
                total: 0
            }
        };
    },
    computed: {
        titleName() {
            let text = "";
            if (this.searchForm.searchMonth) {
                text = "月销售额"
            } else {
                text = "年销售额";
            }

            return text
        },
        monthDisabled() {
            if (this.searchForm.searchYear) {
                return false;
            } else {
                return true;
            }
        },
        dayDisabled() {
            if (!this.monthDisabled && this.searchForm.searchMonth) {
                return false;
            } else {
                return true;
            }
        },
        columns() {
            if (this.navIndex != 3) {
                return [
                    {
                        title: "时间",
                        key: "time"
                    },
                    {
                        title: "销售额（元）",
                        key: "money"
                    },
                ]
            } else {
                return [
                    // {
                    //     title: "时间",
                    //     key: "time"
                    // },
                    {
                        title: "ID",
                        key: "id"
                    },
                    {
                        title: "昵称",
                        key: "name"
                    },
                    {
                        title: "手机号",
                        key: "phone"
                    },
                    {
                        title: "代理类型",
                        key: "type"
                    },
                    {
                        title: "销售额（元）",
                        key: "money",
                        renderHeader: (h, column) => {
                            return h("span", this.columnIndexTitle + "销售额（元）");
                        }
                    },
                    {
                        title: "返佣收益（元）",
                        key: "money",
                        renderHeader: (h, column) => {
                            return h("span", this.columnIndexTitle + "返佣收益（元）");
                        }
                    }
                ]
            }
        }
    },
    methods: {
        toggleNav(i) {
            this.navIndex = i;
            this.searchForm = {
                searchYear: new Date(),
                searchMonth: new Date(),
                searchDay: new Date(new Date().getTime() - (24*60*60*1000)),
                id: "",
                phone: "",
                type: ""
            };
            this.page.current = 1;
            this.page.total = 0;
            this.tableData = [];
        },
        changeYear(date) {
            this.searchForm.searchYear = date;
            if (!date) {
                this.searchForm.searchMonth = "";
                this.searchForm.searchDay = "";
            }
        },
        changeMonth(date) {
            this.searchForm.searchMonth = date;
            if (!date) {
                this.searchForm.searchDay = "";
            }
        },
        changeDay(date) {
            this.searchForm.searchDay = date;
        },
        searchBtn() {
            this.page.current = 1;
            this.tableData = [];
            if (this.searchForm.searchDay) {
                this.columnIndexTitle = "日";
            } else if (this.searchForm.searchMonth) {
                this.columnIndexTitle = "月";
            } else {
                this.columnIndexTitle = "年";
            } 
        },
        obtainData() {},
        changePage(i) {
            this.page.current = i;
            this.obtainData();
        },
    },
    mounted() {
        // 获取年份
        let nowYear = new Date().getFullYear();
        console.log(new Date().getFullYear())
        for (let i= nowYear - 10; i < nowYear + 20; i++) {
            this.yearArr.push(i);
        }
    }
};
</script>

<style lang="less" scoped>
.red {
    color: red;
}
.top-nav {
    display: flex;
    margin-bottom: 20px;
    li {
        width: 300px;
        border: 1px solid #eee;
        text-align: center;
        padding: 25px 0;
        background: #fff;
        cursor: pointer;
        margin-right: 20px;
        &.active {
            background: #ddd;
        }
        .num {
            font-size: 18px;
            color: red;
        }
    }
}
.data-card {
    display: flex;
    justify-content: space-between;
}
/deep/ .not-events {
    .ivu-select-dropdown .ivu-date-picker-header {
        cursor: default;
        pointer-events: none;
    }
}
</style>
