<template>
<div>
  <div style="display:flex;flex-wrap: wrap;"> 
    <Card style="width:450px;margin-right:5px;margin-top:10px">
      <p slot="title">预计存储物品</p>
      <Table border :columns="columns" :data="dataGoods">
      </Table>
    </Card>
    <Card style="width:600px;margin-right:5px;margin-top:10px">
      <p slot="title">预计使用纸箱</p>
      <Table border :columns="caseColumns" :data="dataBox">
      </Table>
    </Card>
  </div>
  <div style="margin-top:20px">
    <Button type="primary" style="margin:0 8px 5px 0" ><Icon type="ios-download-outline" @click="pdfClick"></Icon>导出取件单</Button>
  </div>
</div>
  
</template>

<script>
import util from '@/libs/util';
import { getBoxList4Order,getGoodsList4Order } from "@api/account";
export default {
  name: 'pendingPayment',
  data () {
    return {
      orderId:'',
      caseColumns:[
        {
          title: '序号',
          align:'center',
          width:75,
          key: 'num'
        },
        {
          title: '纸箱名称',
          align:'center',
          key: 'boxName'
        },
        {
          title: '类型',
          align:'center',
          width:90,
          key: 'boxType'
        },
        {
          title: '使用数量',
          align:'center',
          width:100,
          key: 'amount'
        },
        {
          title: '总价',
          align:'center',
          width:80,
          key: 'storePerDayFee'
        },
      ],
      columns: [
        {
          title: '序号',
          align:'center',
          width:75,
          key: 'num'
        },
        {
          title: '物品名称',
          align:'center',
          key: 'name'
        },
        {
          title: '数量',
          align:'center',
          width:80,
          key: 'amount'
        },
      ],
      dataBox: [
          
      ],
      dataGoods:[]
      
    }
  },
  mounted () {
    //
  },
  methods:{
    getData(id){
      this.orderId=id
      getBoxList4Order(id).then(res=>{
        var arr = res.data
        let num =0
        arr.forEach(v => {
          num++
          v.num=num
          v.boxName=v.box.name
          v.boxType=v.box.type.name
          v.storePerDayFee= (Number(v.amount)  *Number(v.box.storePerMonthFee)).toFixed(2) 
        });
        this.dataBox=arr
        
      })
      getGoodsList4Order(id).then(res=>{
        var arr = res.data
        let num =0
        arr.forEach(v => {
           num++
          v.num=num
        });
        this.dataGoods =arr
      })
    },
    pdfClick(){
      window.open("http://cuncun.admin.iisu.cn/export/depositReceipt.html?id="+this.orderId+'&token='+util.cookies.get('token1'));  
    },
  }
}
</script>

<style lang="less">

</style>
