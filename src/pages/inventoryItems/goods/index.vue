<template>
  <div>
    <Card>
      <p slot="title">仓储物品列表</p>
      <Form inline :label-width="80" >
          <FormItem label="用户ID" >
            <Input  placeholder="请输入" style="width:200px" v-model="searchList.userCode"></Input>
          </FormItem>
          <FormItem label="用户姓名" >
            <Input  placeholder="请输入" style="width:200px" v-model="searchList.userName"></Input>
          </FormItem>
          <FormItem label="联系电话" >
            <Input  placeholder="请输入" style="width:200px" v-model="searchList.userMobile"></Input>
          </FormItem>
          <FormItem label="订单号" >
            <Input  placeholder="请输入" style="width:200px" v-model="searchList.orderNo"></Input>
          </FormItem>
          <FormItem label="库位号" >
            <Input  placeholder="请输入" style="width:200px" v-model="searchList.storeCode"></Input>
          </FormItem>
          <FormItem label="流转状态" >
            <Select clearable style="width:200px" v-model="searchList.storeStatus">
                <Option  value="store">存储中</Option>
                <Option  value="withdraw">已取回</Option>
                <Option  value="fetch">取回中</Option>
            </Select>
          </FormItem>
          <FormItem label="取单号码" >
            <Input  placeholder="请输入" style="width:200px" v-model="searchList.wOrderNo"></Input>
          </FormItem>
          <FormItem label="箱子编号" >
            <Input  placeholder="请输入" style="width:200px" v-model="searchList.packCode"></Input>
          </FormItem>
          <FormItem label="物品编号" >
            <Input  placeholder="请输入" style="width:200px" v-model="searchList.code"></Input>
          </FormItem>
          <FormItem label="物品名称" >
            <Input  placeholder="请输入" style="width:200px" v-model="searchList.name"></Input>
          </FormItem>
          <FormItem label="物品归类" >
            <Cascader transfer :data="categoryList" trigger="hover" v-model="searchList.categoryId" ></Cascader>
          </FormItem>
          <FormItem label="标签" >
            <Input  placeholder="请输入" style="width:200px" v-model="searchList.tag" ></Input>
          </FormItem>
          <FormItem >
            <Button type="warning" icon="ios-search" style="" @click="getList()">搜索</Button>
            <Button style="margin-left:10px" @click="emptySearchList">清空</Button>
          </FormItem>
      </Form>
      <div style="margin-top:20px">
        <Table border ref="selection" :columns="columnsList" :data="dataList" >
          <template slot-scope="{ row, index }" slot="circulationType">
            <Button type="success" size="small" v-show="row.storeStatus.code=='withdraw'">已取回</Button>
            <Button type="info" size="small" v-show="row.storeStatus.code=='store'">存储中</Button>
            <Button type="warning" size="small" v-show="row.storeStatus.code=='fetch'">取回中</Button>
          </template>
          <template slot-scope="{ row, index }" slot="imgKey">
            <Button type="success" size="small" @click="imgClick(row.coverPic)">查看</Button>
          </template>
          <template slot-scope="{ row, index }" slot="operation">
            <Button type="text" size="small"  style="margin-right: 5px;color:#19be6b;">详情</Button>
          </template>
        </Table>
      </div>
      <div class="page" style="margin-top:20px;display:flex;justify-content:space-between">
        <div class="operationBtn">
          <!-- <Button type="success" @click="modal1=true">添加物品</Button> -->
          <Button type="primary" style="margin:0 8px 5px 0" @click="exportData()">导出列表</Button>
        </div>
        <Page :total="total" show-total @on-change="changePage" show-sizer :page-size-opts="[10,20,50,100]" @on-page-size-change="pageSizeChange"></Page>
      </div>
    </Card>
    <Modal
        v-model="modal1"
        title="物品"
      >
      <Form  :label-width="80" >
          <FormItem label="用户ID" >
            <Select  style="width:250px">
                <Option  value="1">111</Option>
                <Option  value="2">222</Option>
            </Select>
          </FormItem>
          <FormItem label="存单编号" >
            <Select  style="width:250px">
                <Option  value="1">111</Option>
                <Option  value="2">222</Option>
            </Select>
          </FormItem>
          <FormItem label="物品编号" >
            <Input  placeholder="请输入" style="width:250px"></Input>
          </FormItem>
          <FormItem label="物品名称" >
            <Input  placeholder="请输入" style="width:250px"></Input>
          </FormItem>
          <FormItem label="库位号" >
            <Input  placeholder="请输入" style="width:250px"></Input>
          </FormItem>
          <FormItem label="箱子编号" >
            <Select  style="width:250px">
                <Option  value="1">111</Option>
                <Option  value="2">222</Option>
            </Select>
          </FormItem>
          <FormItem label="物品归类" >
            <Select  style="width:250px">
                <Option  value="1">111</Option>
                <Option  value="2">222</Option>
            </Select>
          </FormItem>
          <FormItem label="展示区域" >
            <Select  style="width:250px">
                <Option  value="1">111</Option>
                <Option  value="2">222</Option>
            </Select>
          </FormItem>
          <FormItem label="标签" >
            <Input  placeholder="请输入" style="width:250px"></Input>
          </FormItem>
          <FormItem label="图片" >
            <Button icon="ios-cloud-upload-outline">上传</Button>
          </FormItem>
      </Form>  
    </Modal>
    <Modal v-model="imgModal"  title="图片" >
      <div style="text-align: center">
        <viewer > 
          <img :src="img" alt="" style="width:200px">
        </viewer>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getInventoryItemsList,getGoodsTree } from "@api/account";
export default {
  // name: 'home',
  data () {
    return {
      img:'',
      imgModal:false,
      modal1:false,
      categoryList:[],
      total: 0,
      pageSize: 10,
      pageNumber: 0,
      columnsList:[
        {
          title: '序号',
          key: 'num',
          width: 70,
          align: 'center'
        },
        {
          title: '用户ID',
          key: 'userId',
          width: 150,
          align: 'center'
        },
        {
          title: '存单编号',
          key: 'orderNo',
          width: 190,
          align: 'center'
        },
        {
          title: '箱子编号',
          key: 'packCode',
          width: 180,
          align: 'center'
        },
        {
          title: '物品编号',
          key: 'code',
          width: 190,
          align: 'center'
        },
        {
          title: '物品名称',
          key: 'name',
          width: 125,
          align: 'center'
        },
        {
          title: '图片',
          slot: 'imgKey',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '所在库位',
          key: 'storeCode',
          width: 120,
          align: 'center'
        },
        {
          title: '物品归类',
          key: 'categoryName',
          width: 150,
          align: 'center'
        },
        {
          title: '展示区域',
          key: 'typeName',
          width: 100,
          align: 'center'
        },
        {
          title: '标签',
          key: 'tags',
          width: 100,
          align: 'center'
        },
        {
          title: '流转状态',
          slot: 'circulationType',
          width: 120,
          align: 'center'
        },
        {
          title: '取单编号',
          key: 'withdrawOrderId',
          width: 190,
          align: 'center'
        },
        // {
        //   title: '操作',
        //   slot: 'operation',
        //   width: 100,
        //   fixed: 'left',
        //   align: 'center'
        // },
      ],
      columnsList1:[
        {
          title: '序号',
          key: 'num',
          width: 70,
          align: 'center'
        },
        {
          title: '用户ID',
          key: 'userId',
          width: 220,
          align: 'center'
        },
        {
          title: '存单编号',
          key: 'orderNo',
          width: 190,
          align: 'center'
        },
        {
          title: '箱子编号',
          key: 'packCode',
          width: 180,
          align: 'center'
        },
        {
          title: '物品编号',
          key: 'code',
          width: 120,
          align: 'center'
        },
        {
          title: '物品名称',
          key: 'name',
          width: 125,
          align: 'center'
        },
        {
          title: '所在库位',
          key: 'storeCode',
          width: 120,
          align: 'center'
        },
        {
          title: '物品归类',
          key: 'categoryName',
          width: 150,
          align: 'center'
        },
        {
          title: '展示区域',
          key: 'typeName',
          width: 100,
          align: 'center'
        },
        {
          title: '标签',
          key: 'tags',
          width: 100,
          align: 'center'
        },
        {
          title: '流转状态',
          key: 'storeStatusCode',
          width: 120,
          align: 'center'
        },
        {
          title: '取单编号',
          key: 'withdrawOrderId',
          width: 190,
          align: 'center'
        },
        // {
        //   title: '操作',
        //   slot: 'operation',
        //   width: 100,
        //   fixed: 'left',
        //   align: 'center'
        // },
      ],
      dataList:[
      ],
      searchList:{
        storeStatus:'',
        orderNo:'',
        storeCode:'',
        packCode:'',
        categoryId:[],
        tag:'',
        code:'',
        name:'',
        wOrderNo:'',
        userMobile:'',
        userCode:'',
        userName:'',
      }
    }
  },
  mounted () {
    //
    this.getList()
    this.GoodsTree()
  },
  methods:{
    //类型列表
    GoodsTree(){
      let goods = {
        parentId:'0'
      }
      getGoodsTree(goods).then(res=>{
        let list = res.data
        list.forEach(v => {
          v.value = v.id
          v.label = v.name
          if (v.children.length>0) {
            v.children.forEach(a => {
              a.value = a.id
              a.label = a.name
            });
          }
        });
        this.categoryList = list
      })
    },
    getList(){
      let data ={
        pageNumber:this.pageNumber,
        pageSize:this.pageSize,
        storeStatus:this.searchList.storeStatus,
        orderNo:this.searchList.orderNo,
        storeCode:this.searchList.storeCode,
        categoryId:this.searchList.categoryId[1],
        tag:this.searchList.tag,
        code:this.searchList.code,
        name:this.searchList.name,
        packCode:this.searchList.packCode,
        wOrderNo:this.searchList.wOrderNo,
        userMobile:this.searchList.userMobile,
        userCode:this.searchList.userCode,
        userName:this.searchList.userName,
      }
      getInventoryItemsList(data).then(res=>{
        var num = 0
        let arr = res.data.data
        arr.forEach(v => {
          num ++ 
          v.num = num
          if (v.user) {
            v.userId=v.user.code
          }
          v.packCode = v.pack.code
          v.orderNo = v.depositOrder.orderNo
          if (v.category) {
            v.categoryName = v.category.name
          }
          v.storeStatusCode = v.storeStatus.name
          v.typeName=v.type.name
          if (v.withdrawOrder) {
            v.withdrawOrderId=v.withdrawOrder.orderNo
          }
          
        });
        this.total = res.data.total
        this.dataList = arr
        
      })
    },
    //清空搜索列表
    emptySearchList(){
      this.searchList.storeStatus=''
      this.searchList.orderNo=''
      this.searchList.storeCode=''
      this.searchList.categoryId=[]
      this.searchList.tag=''
      this.searchList.code=''
      this.searchList.name=''
      this.searchList.wOrderNo=''
      this.searchList.userMobile=''
      this.searchList.userCode=''
      this.searchList.userName=''
      this.searchList.packCode=''
    },
    //选择状态
    tabsClick(name){
      this.searchList.status = name
      this.pageNumber = 0
      this.getList()
    },
    changePage (page) {
      this.pageNumber = page - 1
      this.getList()
    },
    pageSizeChange(pageSize){
      this.pageSize=pageSize
      this.getList()
    },
    imgClick(img){
      this.img = img
      this.imgModal=true
    },
    exportData (type) {
      this.$refs.selection.exportCsv({
          filename: '库存物品列表',
          columns: this.columnsList1,
          data:this.dataList
      });
    }
  }
}
</script>

<style lang="less">
  .operationBtn button{
    margin-right: 20px;
    
  }
</style>
