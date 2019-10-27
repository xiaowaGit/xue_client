import { GameUtils } from "../utils/GameUtils";
import Alert from "../base/Alert";
import { Http } from "../net/Http";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginScene extends cc.Component {

    //////////////////// register 注册页面

    @property(cc.EditBox)
    register_account: cc.EditBox = null;
    @property(cc.EditBox)
    register_password: cc.EditBox = null;
    @property(cc.EditBox)
    register_name: cc.EditBox = null;
    @property(cc.Toggle)
    sex_man: cc.Toggle = null;
    @property(cc.Toggle)
    sex_woman: cc.Toggle = null;
    @property(cc.Button)
    btn_register:cc.Button = null;

    //////////////////// login 登录页面
    
    @property(cc.EditBox)
    login_account: cc.EditBox = null;
    @property(cc.EditBox)
    login_password: cc.EditBox = null;
    @property(cc.Button)
    btn_login:cc.Button = null;


    ///////////////// 弹窗组件
    @property(cc.Prefab)
    alertPrefab: cc.Prefab = null;

    // 弹窗
    private alertDialog: cc.Node = null;

    start () {
        let self = this;
        this.btn_register.node.on("click",function () {
            self.register();
        },this);
        this.btn_login.node.on("click",function () {
            self.login();
        },this);
        
        this.alertDialog = cc.instantiate(this.alertPrefab);
        this.alertDialog.x = GameUtils.centre_x;
        this.alertDialog.y = GameUtils.centre_y;
    }

    /**
     * 注册账号
     */
    register() {
        let account:string = this.register_account.string;
        let password:string = this.register_password.string;
        let name:string = this.register_name.string;
        let sex:string = '';
        if (this.sex_man.isChecked) sex = '男';
        else if (this.sex_woman.isChecked) sex = '女';

        let alert:Alert = this.alertDialog.getComponent(Alert);
        ///// 检测参数
        if (account.length < 5) {
            alert.showAlert('账户名过短.', function(){
                console.log("xiaowa========== account.length < 5");
            }, false);
            return;
        }
        if (password.length < 5) {
            alert.showAlert('密码过短.', function(){
            }, false);
            return;
        }
        if (name.length < 1) {
            alert.showAlert('姓名过短.', function(){
            }, false);
            return;
        }
        let url:string = GameUtils.http_url+'/register';
        Http.post(url,{account,password,name,sex},(eventName: string, xhr: XMLHttpRequest)=>{
            if (eventName == 'COMPLETE') {
                if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                    var response = JSON.parse(xhr.responseText)
                    console.log(response);
                    if (response.code == 0) {
                        alert.showAlert('恭喜，注册成功.', function(){
                        }, false);
                    }else{
                        alert.showAlert(response.data, function(){
                        }, false);
                    }
                }
            } else if (eventName == 'TIMEOUT') {
                //TODO:添加提示连接网关超时
                console.log("超时");
            } else if (eventName == 'ERROR') {
                console.log("错误");
            }
        },this);
    }

    /**
     * 登录游戏
     */
    login() {

        let account:string = this.login_account.string;
        let password:string = this.login_password.string;

        let alert:Alert = this.alertDialog.getComponent(Alert);
        ///// 检测参数
        if (account.length < 5) {
            alert.showAlert('账户名过短.', function(){
                console.log("xiaowa========== account.length < 5");
            }, false);
            return;
        }
        if (password.length < 5) {
            alert.showAlert('密码过短.', function(){
            }, false);
            return;
        }
        let url:string = GameUtils.http_url+'/login';
        Http.post(url,{account,password},(eventName: string, xhr: XMLHttpRequest)=>{
            if (eventName == 'COMPLETE') {
                if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                    var response = JSON.parse(xhr.responseText)
                    console.log(response);
                    if (response.code == 0) {
                        GameUtils.uid = response.data.uid;
                        GameUtils.token = response.data.token;
                        console.log("xiaowa===== 登录成功,uid,token = ",GameUtils.uid,GameUtils.token);
                        this.entry();
                    }else{
                        alert.showAlert(response.data, function(){
                        }, false);
                    }
                }
            } else if (eventName == 'TIMEOUT') {
                //TODO:添加提示连接网关超时
                console.log("超时");
            } else if (eventName == 'ERROR') {
                console.log("错误");
            }
        },this);
    }

    /**
     * 登录长连接服务器
     */
    entry() {

        this.btn_login.enabled = false;//防止继续点击
        this.btn_login.interactable = false;
        GameUtils.getInstance().init();
        var pinus = GameUtils.getInstance().pinus;
        var host = "127.0.0.1";

        let self = this;
        // query connector
        function queryEntry(uid, callback) {
            
            return callback("17731in702.iask.in", 10426);

            var route = 'gate.gateHandler.queryEntry';
            pinus.init({
                host: host,
                port: 3014,
                log: true
            }, function() {
                pinus.request(route, {
                    uid: uid
                }, function(data) {
                    pinus.disconnect();
                    if(data.code === 500) {
                        console.log("xiaowa ========= queryEntry fail");
                        self.btn_login.enabled = true;
                        self.btn_login.interactable = true;
                        return;
                    }
                    callback(data.host, data.port);
                    // callback("17731in702.iask.in", 26127);
                });
            });
        };

        //query entry of connection
		queryEntry(""+GameUtils.uid, function(host:string,port:string) {
			pinus.init({
				host: host,
				port: port,
				log: true
			}, function() {
				var route = "connector.entryHandler.entry";
				pinus.request(route, {
                    uid:GameUtils.uid,
                    token:GameUtils.token,
				}, function(data) {
					if(data.error) {
                        console.log("xiaowa ========= entry fail");
                        self.btn_login.enabled = true;
                        self.btn_login.interactable = true;
						return;
					}else{
                        cc.log(data);
                        if (data.code == 0) { // 登录成功，进入大厅
                            cc.director.loadScene("HallScene");
                        }
                    }
				});
			});
        });
        
    }
}
