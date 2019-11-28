<template>
    <div>
        <Row :gutter="20" type="flex" justify="space-between">
            <i-col
                :xs="12"
                :md="12"
                :lg="6"
                v-for="(infor, i) in inforCardData"
                :key="`infor-${i}`"
                style="height: 200px;padding-bottom: 80px;"
            >
                <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
                    <count-to :end="infor.count" count-class="count-style" />
                    <p>{{ infor.title }}</p>
                </infor-card>
            </i-col>
        </Row>
        <Row :gutter="20" style="margin-top: 10px;">
            <i-col :md="12" :lg="12" style="margin-bottom: 20px;">
                <Card shadow>
                    <chart-bar style="height: 300px; " :value="barDatati" text="今日提币数量" />
                </Card>
            </i-col>
            <i-col :md="12" :lg="12" style="margin-bottom: 20px;">
                <Card shadow>
                    <chart-bar style="height: 300px;" :value="barDatachong" text="今日充币数量" />
                </Card>
            </i-col>
        </Row>
    </div>
</template>
<script>
import InforCard from "_c/info-card";
import CountTo from "_c/count-to";
import { ChartPie, ChartBar } from "_c/charts";
import { indexCount } from "@/api/api";

export default {
    name: "home",
    components: {
        InforCard,
        CountTo,
        ChartPie,
        ChartBar
    },
    data() {
        return {
            blockData: {
                officialUser: 0,
                totalUser: 0,
                waitAuditCoin: 0,
                dealFeeTotal: 0
            },
            pieDatachong: [
                { value: 0, name: "今日USDT充币" }
                // { value: 0, name: '今日ETC8充币' },
                // { value: 0, name: '今日CLS充币' },
                // { value: 0, name: '今日AXGY充币' }
            ],
            pieDatati: [
                { value: 0, name: "今日USDT提币" }
                // { value: 0, name: '今日ETC8提币' },
                // { value: 0, name: '今日CLS提币' },
                // { value: 0, name: '今日AXGY提币' }
            ],
            barDatachong: {
                USDT: 0
                // ETC8: 0,
                // CLS: 0,
                // AXGY: 0
            },
            barDatati: {
                USDT: 0
                // ETC8: 0,
                // CLS: 0,
                // AXGY: 0
            }
        };
    },
    computed: {
        inforCardData() {
            return [
                {
                    title: "正式会员",
                    icon: "ios-aperture",
                    count: this.blockData.officialUser,
                    color: "#19be6b"
                },
                {
                    title: "会员总数",
                    icon: "md-aperture",
                    count: this.blockData.totalUser,
                    color: "#ff9900"
                },
                {
                    title: "待审核提币数",
                    icon: "md-exit",
                    count: this.blockData.waitAuditCoin,
                    color: "#ed4014"
                },
                {
                    title: "C2C交易手续费",
                    icon: "md-cash",
                    count: this.blockData.dealFeeTotal,
                    color: "rgb(154, 102, 228)"
                }
            ];
        }
    },
    methods: {
        getdata() {
            let _this = this;
            indexCount()
                .then(function(response) {
                    if (response.data.code == 200) {
                        _this.blockData.officialUser =
                            response.data.data.officialUser;
                        _this.blockData.totalUser =
                            response.data.data.totalUser;
                        _this.blockData.waitAuditCoin =
                            response.data.data.waitAuditCoin;
                        _this.blockData.dealFeeTotal =
                            response.data.data.dealFeeTotal;
                        _this.barDatati.USDT = response.data.data.USDT.mention;
                        _this.barDatachong.USDT =
                            response.data.data.USDT.charge;
                        for (var variable in response.data.result) {
                            switch (variable) {
                                case "USDT":
                                    _this.pieDatachong[0].value =
                                        response.data.result[variable].charge;
                                    _this.barDatachong.USDT =
                                        response.data.result[variable].charge;
                                    _this.pieDatati[0].value =
                                        response.data.result[variable].mention;
                                    _this.barDatati.USDT =
                                        response.data.result[variable].mention;
                                    break;
                                case "ETC8":
                                    _this.pieDatachong[1].value =
                                        response.data.result[variable].charge;
                                    _this.barDatachong.ETC8 =
                                        response.data.result[variable].charge;
                                    _this.pieDatati[1].value =
                                        response.data.result[variable].mention;
                                    _this.barDatati.ETC8 =
                                        response.data.result[variable].mention;
                                    break;
                                case "CLS":
                                    _this.pieDatachong[2].value =
                                        response.data.result[variable].charge;
                                    _this.barDatachong.CLS =
                                        response.data.result[variable].charge;
                                    _this.pieDatati[2].value =
                                        response.data.result[variable].mention;
                                    _this.barDatati.CLS =
                                        response.data.result[variable].mention;
                                    break;
                                case "AXGY":
                                    _this.pieDatachong[3].value =
                                        response.data.result[variable].charge;
                                    _this.barDatachong.AXGY =
                                        response.data.result[variable].charge;
                                    _this.pieDatati[3].value =
                                        response.data.result[variable].mention;
                                    _this.barDatati.AXGY =
                                        response.data.result[variable].mention;
                                    break;
                                default:
                                    // statements_def
                                    break;
                            }
                        }
                    } else {
                        _this.$Message.error("获取数据失败");
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    },
    mounted() {
        this.getdata();
    }
};
</script>
<style lang="less">
.count-style {
    font-size: 28px;
}
</style>