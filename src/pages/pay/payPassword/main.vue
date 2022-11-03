<template>
  <view class="pay-password">
    <view class="content">
      <input type="number" v-model="password" :password="true" maxlength="6" placeholder="请输入六位数支付密码" />
      <button type="default" :style="{background: baseColor}" @click="paySubmit" :disabled="isdis">确认支付</button>
    </view>
  </view>
</template>

<script>
  import http from '@/api/http.js';
  import {
    paymentCommit,
    syncContractPayState,
	syncContractBatchPayState
  } from '@/api/interface.js';
  export default {
    data() {
      return {
        ptradeSeqno: '',
        payCommitStr: '',
        contractBlance: '',
        contractBillcode: "",
		contractBbillcode:"",
        password: '',
		money:'',
		isdis:false,
      };
    },
    onLoad(options) {
      if (options) {
        this.ptradeSeqno = options.ptradeSeqno;
		let patlist = JSON.parse(options.payCommitStr)
		console.log(patlist,6666)
        this.payCommitStr = [{
						faccountIdType: "ACCOUNT",
			          fchannelCode: patlist.fchannelCode,
			          orderAmount: options.money,
			          faccountId: patlist.faccountOuterNo || ""
			
		}];
		// this.money = options.money
        this.contractBlance = options.contractBlance;
		
			this.contractBillcode = options.contractBillcode;
		
		
			this.contractBbillcode = options.contractBbillcode;
		
        console.log(options,options.contractBillcode,this.contractBbillcode,this.contractBillcode,555);
      }
    },
	onShow(){
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
	},
    mounted() {},
    methods: {
      paySubmit() {
        if (!this.password) {
          this.$message.alert('请输入支付密码');
          return;
        }
        if (this.password.length < 6) {
          this.$message.alert('请输入完整支付密码');
          return;
        }
		this.isdis = true
        this.$message.loading();
        http.post(paymentCommit, {
          ptradeSeqno: this.ptradeSeqno,
          payCommitStr: JSON.stringify(this.payCommitStr),
          contractBlance: this.contractBlance,
		  
          paywd: this.password
        }).then(res => {
          if (res && res.success) {
			  if(!this.contractBbillcode){
            http.post(syncContractPayState, {
                contractBillcode: this.contractBillcode
              })
              .then(res => {
                if (res.success) {
				  this.$routers.push('/pages/paySuccess/paySuccess', {contractBillcode: this.contractBillcode})
                } else {
                  this.$message.alert('支付超时，请重新下单！');
                }
              })
              .catch(err => {
                this.$message.alert('支付超时，请重新下单！');
              });
			  }
			  else{
				http.post(syncContractBatchPayState, {
				    contractBbillcode: this.contractBbillcode
				  })
				  .then(res => {
				    if (res.success) {
					  this.$routers.push('/pages/paySuccess/paySuccess', {contractBillcode: this.contractBillcode,contractBbillcode: this.contractBbillcode})
				    } else {
				      this.$message.alert('支付超时，请重新下单！');
				    }
				  })
				  .catch(err => {
				    this.$message.alert('支付超时，请重新下单！');
				  });  
			  }
          } else {
            this.$message.alert(res.msg);
          }
        });
      }
    }
  };
</script>

<style lang="less" scoped>
  .pay-password {
    width: 100%;
    height: 100%;
    background-color: #ffffff;

    .content {
      padding-top: 91rpx;

      input {
        width: 80%;
        height: 91rpx;
        font-size: 30rpx;
        color: #333333;
        margin: 0 auto;
        margin-top: 30rpx;
        border-bottom: 1rpx solid #cccccc;
      }

      button {
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 200rpx;
		text-align: center;
		font-size: 32rpx;
        width: 90%;
        margin: 0 auto;
        margin-top: 300rpx;
        color: #ffffff;
      }
    }
  }
</style>
