<template>
  <div>
    <div style="display:flex;"> 
      <Card style="width:38%;margin-right:5px;margin-top:10px">
        <p slot="title">纸箱列表</p>
        <p slot="extra" style="color:red">双击纸箱列表添加物品</p>
        <Table border :columns="columns" :data="boxData" @on-row-dblclick="oneOnRowClick" :row-class-name="rowClassName">
          <template slot-scope="{ row, index }" slot="num">
            <div v-show="boxEdit==false">{{row.code}}</div>
            <Input v-show="boxEdit==true"  placeholder="请输入" v-model="row.code" @on-change="boxData[index].code= row.code"></Input>
          </template>
          <template slot-scope="{ row, index }" slot="inspectType">
            <Icon type="md-checkmark-circle" v-show="row.auditStatus=='pass'" size='24' color="#19be6b" @click="boxEdit==true?boxData[index].auditStatus='fail':''"/>
            <Icon type="md-close-circle" v-show="row.auditStatus=='fail'" size='24' color="#ed4014" @click="boxEdit==true?boxData[index].auditStatus='pass':''"/>
          </template>
          <template slot-scope="{ row, index }" slot="remarks">
            <Poptip :content="row.auditRemark" placement="top" transfer>
              <Button type="primary" size="small">查看</Button>
            </Poptip>
          </template>
          <template slot-scope="{ row, index }" slot="operation">
            <Button type="text" size="small"  style="margin-right: 5px;color:#19be6b;" @click="detailsClick(row)">详情</Button>
            <Poptip
              confirm
              transfer
              title="您确认删除这条内容吗？"
              @on-ok="okDel(row.id)"
            >
            <Button type="text" size="small"  style="margin-right: 5px;color:#ff9900;">删除</Button>
            </Poptip>
          </template>
        </Table>
        <div style="margin-top:20px">
          <Button type="info" style="margin:0 8px 5px 0" @click="boxModal=true">添加一行</Button>
        </div>
      </Card>
      <Card style="margin-right:5px;margin-top:10px;box-sizing:border-box;width:60%" >
        <p slot="title">物品列表</p>
        <div v-show="boxType=='A'">
          <Table border :columns="caseColumns" :data="data">
            <template slot-scope="{ row, index }" slot="num">
              <Input  placeholder="请输入" v-model="row.code" @on-change="data[index].code= row.code"></Input>
            </template>
            <template slot-scope="{ row, index }" slot="name">
              <Input  placeholder="请输入" v-model="row.name" @on-change="data[index].name= row.name"></Input>
            </template>
            <template slot-scope="{ row, index }" slot="exhibition">
              <Select transfer v-model="row.type" @on-change="data[index].type= row.type">
                <Option  value="bookcase" >书架</Option>
                <Option  value="armoire" >衣柜</Option>
                <Option  value="shoebox" >鞋柜</Option>
                <Option  value="storeroom" >储藏室</Option>
                <!-- <Option  value="sundries" >杂物室</Option> -->
              </Select>
            </template>
            <template slot-scope="{ row, index }" slot="classification">
              <Cascader transfer :data="categoryList" trigger="hover" v-model="row.categoryId" @on-change="onChangeCascader(index, $event)"></Cascader>
            </template>
            <template slot-scope="{ row, index }" slot="label">
              <Input  placeholder="请输入"  v-model="row.tags" @on-change="data[index].tags= row.tags"></Input>
            </template>
            <template slot-scope="{ row, index }" slot="img">
              <Button type="success" size="small" v-show="row.coverPic!=null" @click="imgClick(row.id,row.coverPic)">查看</Button>
              <Button type="primary" size="small" v-show="row.coverPic==null"  @click="imgClick(row.id,'')">上传</Button>
            </template>
            <template slot-scope="{ row, index }" slot="kg">
              <Input  placeholder="请输入" v-model="row.weight" @on-change="data[index].weight= row.weight"></Input>
            </template>
            <template slot-scope="{ row, index }" slot="imgRemarks">
              <Input  placeholder="请输入" v-model="row.auditRemark" @on-change="data[index].auditRemark= row.auditRemark"></Input>
            </template>
            <template slot-scope="{ row, index }" slot="operation">
              <Poptip
                confirm
                transfer
                title="您确认删除这条内容吗？"
                @on-ok="okGoodsDel(row.id)"
              >
              <Button type="text" size="small"  style="margin-right: 5px;color:#ff9900;">删除</Button>
              </Poptip>
            </template>
          </Table>
          <div style="margin-top:20px">
            <Button type="info" style="margin:0 8px 5px 0" @click="addGoodsClick">添加一行</Button>
            <Button type="success" style="margin:0 8px 5px 0" @click="saveItemsClick('1')">保存</Button>
            <Button type="warning" style="margin:0 8px 5px 0" @click="publishMessage">发布信息</Button>
          </div>
        </div>
        <div v-show="boxType=='B'">
          <p slot="title">请输入箱内物品信息</p>
          <Input  type="textarea" :rows="6" show-word-limit maxlength="45" placeholder="" v-model="remark"/>
          <div style="margin-top:20px">
            <Button type="success" style="margin:0 8px 5px 0" @click="saveItemsClick('2')">保存</Button>
            <!-- <Button type="warning" style="margin:0 8px 5px 0" @click="publishMessage">发布信息</Button> -->
          </div> 
        </div>
      </Card>
      
    </div>
    <div style="margin-top:20px">
      <Poptip
        confirm
        title="是否确认此步骤已完成?"
        @on-ok="stepComplete"
      >
        <Button type="success" style="margin:0 8px 5px 0" >此步骤已完成</Button>
      </Poptip>
      <Button type="primary" style="margin:0 8px 5px 0" @click="pdfClick"><Icon type="ios-download-outline"></Icon>导出取件单</Button>
    </div>
    <Modal v-model="refusalOfOrdersModal"  title="照片上传" @on-visible-change="visibleChange">
      <div style="text-align: center">
        <img :src="img" alt="" style="width:100px">
        <p style="color:red">注：建议添加 100*100px的照片；</p>
        <Upload
          :before-upload="handleUpload"
          :headers="headers"
          :on-success="uploadSuccess"
          ref="upload"
          :data='uploadList'
          :show-upload-list='false'
          name='file'
          action="/server/data/admin/goods/pic/upload">
          <Button icon="ios-cloud-upload-outline">上传照片</Button>
        </Upload>
      </div>
      
      <div slot="footer">
        <div style="">
          <Button type="text" style="margin-right:10px;" @click="cancel">取消</Button>
          <Button type="primary" style="margin-right:10px" @click="upload1">保存</Button>
        </div>
      </div>
    </Modal>
    <Modal v-model="boxModal"  title="添加/编辑纸箱" @on-visible-change="boxModalChange" :mask-closable='false'>
      <Form ref="boxList" :model="boxList" :rules="ruleValidate" :label-width="150">
        <FormItem label="纸箱编号" prop="code" style="margin-bottom:20px">
            <Input v-model="boxList.code" placeholder="请输入" style="width:300px"></Input>
        </FormItem>
        <FormItem label="纸箱类型" style="margin-bottom:20px">
            <Select placeholder="请选择" @on-change="boxTypeChange(boxList.type)" style="width:300px" v-model="boxList.type">
                <Option value="A">拍照</Option>
                <Option value="B">不拍照</Option>
            </Select>
        </FormItem>
        <FormItem label="纸箱名称" prop="boxId" style="margin-bottom:20px">
            <Select transfer v-model="boxList.boxId" style="width:300px">
              <Option v-for="item in boxTypeList" :value="item.id" :key="item.value">{{ item.name }}</Option>
            </Select>
        </FormItem>
        <FormItem label="纸箱重量(kg)" prop="weight" style="margin-bottom:20px">
            <Input v-model="boxList.weight" placeholder="请输入" style="width:300px"></Input>
        </FormItem>
        <FormItem label="安检状态" prop="auditStatus" style="margin-bottom:20px">
            <Select placeholder="请选择" v-model="boxList.auditStatus" style="width:300px">
                <Option value="pass">通过</Option>
                <Option value="fail">未通过</Option>
            </Select>
        </FormItem>
        <FormItem label="管理员备注" style="margin-bottom:20px">
            <Input v-model="boxList.auditRemark" placeholder="请输入" show-word-limit maxlength="45" style="width:300px"></Input>
        </FormItem>
      </Form>        
      <div slot="footer">
        <div style="">
          <Button type="text" style="margin-right:10px;" @click="boxCancel">取消</Button>
          <Button type="primary" style="margin-right:10px" @click="boxClickOk">保存</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getBoxTypeList,
getPackPage,
getPackAdd,
getPackDel,
getDepositGoodsSave,
getDepositGoodsList,
getDepositGoodsDel,
getDepositGoodsPicList,
getDepositGoodsShow,
timeDate,
getGoodsTree,
getCompleteReady,
getUpdateRemark,
 } from "@api/account";
 import util from '@/libs/util';
export default {
  name: 'pendingDisposal',
  data () {
    return {
      boxList:{
        id:'',
        depositOrderId:'',
        code:'',
        boxId:'',
        weight:'',
        auditStatus:'',
        auditRemark:'',
        type:'',
      },
      boxTypeList:[],
      boxModal:false,
      listColor:undefined,
      boxType:'',//箱子类型
      remark:'',//不拍照箱子输入信息
      num:0,
      boxEdit:false,
      refusalOfOrdersModal:false,
      orderId:'',
      packId:'',
      uploadList:{
        goodsId:'',
        cover:true
      },//图片上传参数
      file: null,//图片状态
      img:'',//图片
      headers:this.$store.state.headers,
      caseColumns:[
        {
          title: '物品编号',
          align:'center',
          width:220,
          slot: 'num'
        },
        {
          title: '名称',
          align:'center',
          width:200,
          slot: 'name'
        },
        {
          title: '展示区域',
          align:'center',
          width:130,
          slot: 'exhibition'
        },
        {
          title: '分类',
          align:'center',
          width:180,
          slot: 'classification'
        },
        {
          title: '标签',
          align:'center',
          width:180,
          slot: 'label'
        },
        {
          title: '照片',
          align:'center',
          width:80,
          slot: 'img'
        },
        {
          title: '重量',
          align:'center',
          width:100,
          slot: 'kg'
        },
        {
          title: '拍照员备注',
          align:'center',
          minWidth:140,
          slot: 'imgRemarks'
        },
        {
          title: '发布时间',
          align:'center',
          width:170,
          key: 'showTime'
        },
        {
          title: '操作',
          align:'center',
          width:100,
          slot: 'operation'
        },
      ],
      columns: [
        {
          title: '纸箱编号',
          align:'center',
          width:230,
          slot: 'num'
        },
        {
          title: '安检状态',
          minWidth:70,
          align:'center',
          slot: 'inspectType'
        },
        {
          title: '备注',
          align:'center',
          width:80,
          slot: 'remarks'
        },
        {
          title: '物品数量',
          align:'center',
          minWidth:100,
          key: 'goodsCount'
        },
        {
          title: '操作',
          align:'center',
          fixed: 'left',
          width:80,
          slot: 'operation'
        },
      ],
      data: [
        
      ],
      cityList: [
        {
            value: '已通过',
            label: '已通过'
        },
      ],
      boxData:[],
      categoryList:[],//分类列表
      ruleValidate: {
        code: [
            { required: true, message: '请输入', trigger: 'blur' }
        ],
        boxId: [
            { required: true, message: '请选择', trigger: 'blur' }
        ],
        weight: [
            { required: true, message: '请输入', trigger: 'blur' }
        ],
        auditStatus: [
            { required: true, message: '请选择', trigger: 'blur' }
        ],
      }
    }
  },
  mounted () {
    //
  },
  methods:{
    getData(id){
      this.orderId=id
      this.boxList.depositOrderId=id
      this.dataList(id)
      this.GoodsTree()
    },
    //箱子列表
    dataList(){
      let data = {
        orderId:this.orderId
      }
      getPackPage(data).then(res=>{
        var arr = res.data
        arr.forEach(v => {
          v.auditStatus=v.auditStatus.code
          if (v.box) {
            v.boxId=v.box.id
            v.type=v.box.type.code
          }
        });
        this.boxData = arr.reverse()
      })
    },
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
    //物品保存
    saveItemsClick(num){
      if (num=='1') {
        for (let i = 0; i < this.data.length; i++) {
          let data = {
            id:this.data[i].id,
            depositOrderId:this.orderId,
            packId:this.packId,
            categoryId:this.data[i].categoryId[1],
            code:this.data[i].code,
            name:this.data[i].name,
            weight:Number(this.data[i].weight) ,
            type:this.data[i].type,
            tags:this.data[i].tags,
            auditRemark:this.data[i].auditRemark,
          }
          getDepositGoodsSave(data).then(res=>{
            if (i==this.data.length-1) {
              this.$Message.success('保存成功')
              this.goodsList()
              this.dataList()
            }
          }).catch(err => {
            if (err.response.data.code =='error_param') {
            var json =err.response.data.data
            var title = ''
            for (var key in json){
              title +=`${json[key]},`
            }
            this.$Message.error(title)
          }else{
            this.$Message.error(err.response.data.message)
          }
          })
        }
      }else if(num=='2'){
        let data ={
          id:this.packId,
          remark:this.remark
        }
        getUpdateRemark(data).then(res=>{
          this.dataList()
          this.$Message.success('保存成功')
        }).catch(err => {
          if (err.response.data.code =='error_param') {
            var json =err.response.data.data
            var title = ''
            for (var key in json){
              title +=`${json[key]},`
            }
            this.$Message.error(title)
          }else{
            this.$Message.error(err.response.data.message)
          }
        })
      }
      
    },
    //纸箱编辑保存
    boxEditClick(){
      if (this.boxEdit==true) {
        for (let i = 0; i < this.boxData.length; i++) {
          let arr = {
            depositOrderId :this.orderId,
            code:this.boxData[i].code,
            boxId:this.boxData[i].boxId,
            weight:this.boxData[i].weight,
            auditStatus:this.boxData[i].auditStatus,
          }
          if (this.boxData[i].id.length>10) {
            arr.id=this.boxData[i].id
          }
          getPackAdd(arr).then(res=>{
            if (i==this.boxData.length-1) {
              this.dataList()
              this.$Message.success('成功');
            }
            
          }).catch(err => {
            if (err.response.data.code =='error_param') {
            var json =err.response.data.data
            var title = ''
            for (var key in json){
              title +=`${json[key]},`
            }
            this.$Message.error(title)
          }else{
            this.$Message.error(err.response.data.message)
          }
          })
        }
      }else{

      }
      this.boxEdit=!this.boxEdit

    },
    //物品添加一行
    addGoodsClick(){
      if (this.packId!='') {
        let data = {
          depositOrderId:this.orderId,
          packId:this.packId
        }
        getDepositGoodsSave(data).then(res=>{
          // console.log(res.data);
          this.data.push({
            id:res.data.id
          })
          // this.goodsList()
        }).catch(err => {
          if (err.response.data.code =='error_param') {
            var json =err.response.data.data
            var title = ''
            for (var key in json){
              title +=`${json[key]},`
            }
            this.$Message.error(title)
          }else{
            this.$Message.error(err.response.data.message)
          }
        })
      }else{
        this.$Message.warning('请双击纸箱列表某一行选择纸箱');
      }
    },
    //编辑添加图片
    imgClick(id,pic){
      if (pic=='') {
        
        this.uploadList.goodsId=id
        this.refusalOfOrdersModal = true
      }else{
        this.img=pic
        this.uploadList.goodsId=id
        this.refusalOfOrdersModal = true
      }
      
    },
    //选中某一条箱子
    oneOnRowClick(data,index){
      if (data.auditStatus=='pass') {
        this.listColor=index
        this.rowClassName()
        this.packId=data.id
        this.boxType= data.box.type.code
        if (data.box.type.code=='A') {
          this.goodsList()
        }else{
          this.remark=data.remark
        }
        
      }else if (data.auditStatus=='fail'){
        this.packId=''
        this.data=[]
        this.$Message.warning('选中的箱子安检状态未通过,不能添加物品，请修改安检状态');
      }
    },
    okDel(id){
      getPackDel({id:id}).then(res=>{
        this.$Message.success('删除成功');
        this.dataList()
      }).catch(err => {
        if (err.response.data.code =='error_param') {
            var json =err.response.data.data
            var title = ''
            for (var key in json){
              title +=`${json[key]},`
            }
            this.$Message.error(title)
          }else{
            this.$Message.error(err.response.data.message)
          }
      })
    },
    //物品列表
    goodsList(){
      let data = {
        packId:this.packId
      }
      getDepositGoodsList(data).then(res=>{
        let arr = res.data
        arr.forEach(v => {
          if (v.showTime) {
            v.showTime= timeDate(new Date(v.showTime))
          }else{
            v.showTime=''
          }
          
          if (v.showTime=='1970-01-01 08:00:00') {
            v.showTime=''
          }
          if (v.type) {
            v.type=v.type.code
          }
          if (v.category) {
            v.categoryId=[
              v.category.parentId,
              v.category.id
            ]
          }else{
            v.categoryId=[]
          }
        });
        this.data = arr.reverse()
      })
    },
    //选择图片
    handleUpload (file) {
      this.file = file;
      this.img = window.URL.createObjectURL(file)
      return false;
    },
    //上传照片成功返回
    uploadSuccess(response, file, fileList){
      this.file = null;
      this.$Message.success('保存成功')
      // this.goodsList()
      this.cancel()
    },
    //发布消息
    publishMessage(){
      if (this.packId!='') {
        let list ={
          packId:this.packId
        }
        getDepositGoodsShow(list).then(res=>{
            this.goodsList()
            this.$Message.success('成功');
        }).catch(err => {
          if (err.response.data.code =='error_param') {
            var json =err.response.data.data
            var title = ''
            for (var key in json){
              title +=`${json[key]},`
            }
            this.$Message.error(title)
          }else{
            this.$Message.error(err.response.data.message)
          }
          
        })
      }else{
        this.$Message.warning('请先选中纸箱');
      }
        
    },
    //调用上传
    upload1(){
      this.$refs.upload.post(this.file);
    },
    //弹窗关闭
    cancel(){
      this.img=''
      this.file=null
      this.uploadList.goodsId=''
      this.refusalOfOrdersModal = false
    },
    visibleChange(key){
      if (key==false) {
        this.cancel()
      }
      
    },
    onChangeCascader(index, event){
      this.data[index].categoryId=event
      
    },
    okGoodsDel(id){
      getDepositGoodsDel({id:id}).then(res=>{
        for (let i = 0; i < this.data.length; i++) {
          if (id == this.data[i].id) {
            this.data.splice(i,1)
          }
        }
        this.$Message.success('成功');
      }).catch(err => {
        if (err.response.data.code =='error_param') {
            var json =err.response.data.data
            var title = ''
            for (var key in json){
              title +=`${json[key]},`
            }
            this.$Message.error(title)
          }else{
            this.$Message.error(err.response.data.message)
          }
      })
    },
    //此步骤已完成
    stepComplete(){
      let data ={
        ids:this.orderId
      }
      getCompleteReady(data).then(res=>{
        this.$emit('detailsRefresh','1')
        this.$Message.success('成功');
      }).catch(err => {
        if (err.response.data.code =='error_param') {
            var json =err.response.data.data
            var title = ''
            for (var key in json){
              title +=`${json[key]},`
            }
            this.$Message.error(title)
          }else{
            this.$Message.error(err.response.data.message)
          }
      })
    },
    //箱子类型选择
    boxTypeChange(row){
      this.boxList.boxId=''
      let data ={
        type:row
      }
      getBoxTypeList(data).then(res=>{
        let arr = res.data
        this.boxTypeList=arr

        // this.boxList = arr 
      })
    },
    //纸箱编辑
    detailsClick(row){
      this.boxTypeChange(row.type)
      this.boxList.id=row.id
      this.boxList.code=row.code
      this.boxList.boxId=row.box.id
      this.boxList.weight=row.weight+''
      this.boxList.auditStatus=row.auditStatus
      this.boxList.auditRemark=row.auditRemark
      this.boxList.type=row.type
      this.boxModal=true
    },
    //箱子添加编辑保存
    boxClickOk(){
      this.$refs['boxList'].validate((valid) => {
          if (valid) {
            getPackAdd(this.boxList).then(res=>{
              this.boxCancel()
              this.dataList()
              this.$Message.success('成功');
            }).catch(err => {
              if (err.response.data.code =='error_param') {
            var json =err.response.data.data
            var title = ''
            for (var key in json){
              title +=`${json[key]},`
            }
            this.$Message.error(title)
          }else{
            this.$Message.error(err.response.data.message)
          }
            })
          } else {
              this.$Message.error('请检查内容必填项是否全部填写!');
          }
      })
    },
     //箱子添加编辑取消
    boxCancel(){
      this.boxModal=false
      this.boxList.id=''
      this.boxList.code=''
      this.boxList.boxId=''
      this.boxList.weight=''
      this.boxList.auditStatus=''
      this.boxList.auditRemark=''
      this.boxList.type=''
      this.boxTypeList=[]
    },
    boxModalChange(key){
      if (key==false) {
        this.boxCancel()
      }
    },
    rowClassName (row, index) {
      if (index === Number(this.listColor) ) {
          return 'demo-table-info-row';
      } 
      return '';
    },
    pdfClick(){
      window.open("http://cuncun.admin.iisu.cn/export/depositReceipt.html?id="+this.orderId+'&token='+util.cookies.get('token1'));  
    },
  }
}
</script>

<style lang="less" scoped>

</style>
