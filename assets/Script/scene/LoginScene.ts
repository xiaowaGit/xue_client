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

        ///// 检测参数
        if (account.length < 5) {
            this.alertDialog.getComponent('Alert').showAlert('账户名过短.', function(){
            }, false);
            this.alertDialog.x = 960;
            this.alertDialog.y = 540;
            return;
        }
    }

    /**
     * 登录游戏
     */
    login() {

    }
}
