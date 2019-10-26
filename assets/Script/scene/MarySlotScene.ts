import Slot from "../base/Slot";
import { Image_Slot } from "../utils/tool";
import PutBetIndex from "../base/PutBetIndex";
import SmallGame from "../base/SmallGame";
import { GameUtils } from "../utils/GameUtils";
import Alert from "../base/Alert";
import { Http } from "../net/Http";
import Coin from "../base/Coin";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MarySlotScene extends cc.Component {

    @property(cc.Node)
    node_line: cc.Node = null;

    @property([cc.Node])
    node_line_list:cc.Node[] = [];

    @property(cc.Node)
    node_slot: cc.Node = null;

    @property(cc.Button)
    btn_start: cc.Button = null;

    @property(cc.Button)
    btn_max_bet:cc.Button = null;

    ///////////////// slot组件
    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    @property(PutBetIndex)
    put_bet_index:PutBetIndex = null;

    @property(cc.Button)
    btn_dec:cc.Button = null;

    @property(cc.Button)
    btn_inc:cc.Button = null;

    @property(cc.Label)
    lbl_put_bet:cc.Label = null;

    @property(SmallGame)
    small_game:SmallGame = null;

    
    ///////////////// 金币组件
    @property(cc.Prefab)
    coin: cc.Prefab = null;


    ///////////////// 弹窗组件
    @property(cc.Prefab)
    alertPrefab: cc.Prefab = null;

    @property(cc.Sprite)
    spr_avatar: cc.Sprite = null;

    @property(cc.Label)
    lbl_name: cc.Label = null;

    @property(cc.Label)
    lbl_coin: cc.Label = null;

    @property(cc.Label)
    lbl_info: cc.Label = null;

    @property(cc.Label)
    lbl_reward: cc.Label = null;

    @property(cc.Label)
    lbl_pool: cc.Label = null;

    ////// node tips
    @property(cc.Node)
    node_tips: cc.Node = null;

    ///// lbl tips
    @property(cc.Label)
    lbl_tips: cc.Label = null;


    //////////////////////  面板相关
    @property(cc.Button)
    btn_rule: cc.Button = null;
    @property(cc.Button)
    btn_set: cc.Button = null;
    @property(cc.Button)
    btn_return: cc.Button = null;

    @property(cc.Node)
    node_rule: cc.Node = null;
    @property(cc.Sprite)
    img_page_1:cc.Sprite = null;
    @property(cc.Sprite)
    img_page_2:cc.Sprite = null;
    @property(cc.Sprite)
    img_page_3:cc.Sprite = null;
    @property(cc.Button)
    btn_next: cc.Button = null;
    @property(cc.Button)
    btn_prev: cc.Button = null;
    @property(cc.Button)
    btn_close_rule:cc.Button = null;

    //// rule tips 面板 编号
    private index_tips:number = 1;

    /// slot
    private slot_list:Slot[] = [];

    private slot_y:number = 45;
    private slot_move_x:number = -485/2;

    private put_bet_list:number[] = [900,1800,2700,3600,4500,5400,6300,7200,8100,9000];
    private bet_index:number = 0;
    private put_bet:number = 900;

    private is_in_room:boolean = false;  /// 是否在房间中

    // 弹窗
    private alertDialog: cc.Node = null;


    /// 小游戏次数
    private small_game_num: number = 0;
    /// 免费游戏次数
    private free_game_num: number = 0;

    //// 金币动效
    private node_coin: cc.Node;

    // onLoad () {}

    //////////////////////////////////////-------视图逻辑-----------------------------------------------

    start () {
        let o_x:number = this.slot_move_x * 2;
        let o_y:number = this.slot_y;
        for (let i = 0; i < 5; i++) {
            let one_slot:cc.Node = cc.instantiate(this.slotPrefab);
            one_slot.x = o_x;
            one_slot.y = o_y;
            o_x -= this.slot_move_x;
            this.node_slot.addChild(one_slot);
            let slot:Slot = one_slot.getComponent(Slot);
            slot.init(false);
            this.slot_list.push(slot);
        }
        
        this.btn_start.node.on("click",this.start_up.bind(this),this);

        this.put_bet_index.init(this.put_bet_list.length);
        this.set_put_bet(0);

        /// 减1 index
        this.btn_dec.node.on('click',function () {
            this.bet_index --;
            if (this.bet_index < 0) this.bet_index = 0;
            this.set_put_bet(this.bet_index);
        },this);
        //// 加1 index
        this.btn_inc.node.on('click',function () {
            this.bet_index ++;
            if (this.bet_index >= this.put_bet_list.length) this.bet_index = this.put_bet_list.length - 1;
            this.set_put_bet(this.bet_index);
        },this);
        //// max
        this.btn_max_bet.node.on('click',function () {
            this.bet_index = this.put_bet_list.length - 1;
            this.set_put_bet(this.bet_index);
        },this);

        this.small_game.node.active = false;
        // this.small_game.init(3);

        ////////////////// 面板相关
        this.btn_rule.node.on('click',function () {
            this.open_rule_panel();
        },this);

        this.btn_close_rule.node.on('click',function () {
            this.close_rule_panel();
        },this);

        this.btn_next.node.on('click',function () {
            this.index_tips ++;
            if (this.index_tips > 3) this.index_tips = 3;
            this.show_index_tips(this.index_tips);
        },this);
        
        this.btn_prev.node.on('click',function () {
            this.index_tips --;
            if (this.index_tips < 1) this.index_tips = 1;
            this.show_index_tips(this.index_tips);
        },this);

        this.close_rule_panel();
        
        this.alertDialog = cc.instantiate(this.alertPrefab);
        this.alertDialog.x = GameUtils.centre_x;
        this.alertDialog.y = GameUtils.centre_y;
        this.node.addChild(this.alertDialog);

        ///// 返回大厅 按钮
        this.btn_return.node.on('click',function () {
            let alert:Alert = this.alertDialog.getComponent(Alert);
            let self = this;
            alert.showAlert('是否退出房间?', function(){
                self.exit_room();
            }, true);
        },this);

        this.get_info();
        this.goto_room();

    }


    set_put_bet(index:number) {
        if (index < 0 || index >= this.put_bet_list.length) return;
        this.put_bet = this.put_bet_list[~~index];
        this.put_bet_index.goto(~~index);
        this.lbl_put_bet.string = "" + this.put_bet;
    }

    /**
     * 更新用户信息，支持部分数据更新
     * @param name 
     * @param coin 
     * @param info 
     * @param reward 
     * @param pool 
     */
    update_info(name:string,coin:number,info:string,reward:number,pool:number) {
        if(name != null)this.lbl_name.string = name;
        if(coin != null)this.lbl_coin.string = ''+coin;
        if(info != null)this.lbl_info.string = info;
        if(reward != null)this.lbl_reward.string = ''+reward;
        if(pool != null)this.lbl_pool.string = ''+pool;
        this.lbl_tips.string = "免费"+this.free_game_num+"次";
    }


    start_slot(ret:[number[],number[],number[],number[],number[]]) {

        this.slot_list[0].start_up(ret[0],50,2);
        this.slot_list[1].start_up(ret[1],50,2.4);
        this.slot_list[2].start_up(ret[2],50,2.8);
        this.slot_list[3].start_up(ret[3],50,3.2);
        this.slot_list[4].start_up(ret[4],50,3.6);


        // let element_list:Image_Slot[] = [Image_Slot.Image_Banana,Image_Slot.Image_Mango,Image_Slot.Image_Pineapple];
        // this.slot_list[0].start_up(element_list,50,4);
        // this.slot_list[1].start_up(element_list,50,4.4);
        // this.slot_list[2].start_up(element_list,50,4.8);
        // this.slot_list[3].start_up(element_list,50,5.2);
        // this.slot_list[4].start_up(element_list,50,5.6);
    }

    /**
     * 播放中奖动画
     * @param total_reward 
     */
    play_reward_animation(total_reward:number) {
        let node:cc.Node = cc.instantiate(this.coin);
        let coin:Coin = node.getComponent(Coin);
        this.node_tips.addChild(node);
        coin.play(total_reward);
        this.node_coin = node;
    }

    /**
     * 停止中奖动画
     */
    stop_reward_animation() {
        if(this.node_coin) {
            this.node_coin.removeFromParent(true);
            this.node_coin = null;
        }
    }

    /**
     * 闪烁线
     * @param line_multiple 
     */
    play_light_line(line_multiple:number[]) {
        this.node_line.active = true;
        let light_list:number[] = [];
        for (let index = 0; index < 9; index++) {
            this.node_line_list[index].active = false;
            if (line_multiple[index] > 0) light_list.push(index);
        }
        let self = this;
        /////// 点亮某一个
        function light_index(index:number) {
            for (let i = 0; i < 9; i++) {
                self.node_line_list[i].active = false;
            }
            self.node_line_list[index].active = true;
        }

        let action_list = [];
        //////// 闪烁
        for (let index = 0; index < light_list.length; index++) {
            const element = light_list[index];
            let action = cc.callFunc(function() {
                light_index(element);
            }, this);
            let finished = cc.delayTime(1);
            action_list.push(action);
            action_list.push(finished);
        }
        self.node_line.runAction(cc.repeatForever(cc.sequence(action_list)));
    }

    /**
     * 停止闪烁线
     */
    stop_light_line() {
        this.node_line.stopAllActions();
        this.node_line.active = false;
    }


    /**
     * 显示指定tips 信息
     * @param index 
     */
    show_index_tips(index:number) {
        index = ~~index;
        if (index < 1 || index > 3) return;
        this.img_page_1.node.active = false;
        this.img_page_2.node.active = false;
        this.img_page_3.node.active = false;

        if (index == 1)this.img_page_1.node.active = true;
        else if (index == 2)this.img_page_2.node.active = true;
        else if (index == 3)this.img_page_3.node.active = true;
    }

    /**
     * 打开游戏规则面板
     */
    open_rule_panel() {
        this.node_rule.active = true;
        this.show_index_tips(this.index_tips);
    }

    /**
     * 关闭游戏规则面板
     */
    close_rule_panel() {
        this.node_rule.active = false;
    }

    /////////////////////////////-----------业务逻辑----------------------------------------------------

    get_info() {
        let alert:Alert = this.alertDialog.getComponent(Alert);
        let url:string = GameUtils.http_url+'/get_info';
        Http.post(url,{uid:GameUtils.uid,token:GameUtils.token},(eventName: string, xhr: XMLHttpRequest)=>{
            if (eventName == 'COMPLETE') {
                if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                    var response = JSON.parse(xhr.responseText)
                    console.log(response);
                    if (response.code == 0) {
                        ///// 显示用户信息
                        let {uid,name,sex,avatar,coin} = response.data;
                        this.update_info(name,coin,'恭喜发财',0,0);
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
     * 开始slot
     */
    start_up() {
        let self = this;
        let alert:Alert = this.alertDialog.getComponent(Alert);
        if (this.is_in_room == false) {
            alert.showAlert('还未进入房间.', function(){
            }, false);
            return;
        }

        ///// 停止动效
        this.stop_light_line();
        this.stop_reward_animation();

        /////// 锁定按钮
        this.btn_start.enabled = false;
        this.btn_start.interactable = false;

        var pinus = GameUtils.getInstance().pinus;
        ///// 开始slot
        let route = "mary_slot.marySlotHandler.put_bet";
        pinus.request(route, {
            bet:this.put_bet,
        }, function(data) {
            if(data.error) {
                console.log("xiaowa ========= entry fail");
                return;
            }else{
                cc.log(data);
                if (data.code && data.code != 0) {
                    alert.showAlert(data.data, function(){
                    }, false);
                    return;
                }else{
                    let {ret,small_game_num,line_multiple,free_game_num,pool_multiple,is_reward,line_reward,pool_reward,total_reward,current_coin,handsel_pool} = data;
                    self.small_game_num = small_game_num;
                    self.free_game_num = free_game_num;
                    let line_reward_num: number = 0;
                    for (let index = 0; index < line_multiple.length; index++) {
                        const element = line_multiple[index];
                        if (element > 0)line_reward_num ++;
                    }
                    let info:string = '恭喜发财';
                    if (line_reward_num > 0) info += ',喜中 '+line_reward_num+' 线';

                    self.start_slot(ret);
                    setTimeout( ()=> {
                        if (is_reward) {/// 播放中奖效果动画
                            self.play_reward_animation(total_reward);
                        }
                        if (line_reward > 0) {
                            self.play_light_line(line_multiple);
                        }
                        self.update_info(null,current_coin,info,total_reward,handsel_pool);
                        /////// 解锁按钮
                        self.btn_start.enabled = true;
                        self.btn_start.interactable = true;

                        if (self.small_game_num > 0) {
                            self.small_game.init(self.small_game_num,current_coin,self.put_bet,self.lbl_coin);
                        }
                    },4000);
                }
            }
        });

    }

    goto_room() {
        let self = this;
        var pinus = GameUtils.getInstance().pinus;
        let route = "mary_slot.marySlotHandler.entry";
        pinus.request(route, {
            room_index:GameUtils.mary_slot_room_index,
        }, function(data) {
            if(data.error) {
                console.log("xiaowa ========= entry fail");
                return;
            }else{
                cc.log(data);
                if (data.code == 0) {
                    self.is_in_room = true;
                }else{
                    let alert:Alert = self.alertDialog.getComponent(Alert);
                    alert.showAlert(data.data, function(){
                    }, false);
                }
            }
        });
    }

    exit_room() {
        let self = this;
        var pinus = GameUtils.getInstance().pinus;
        let route = "mary_slot.marySlotHandler.leave";
        pinus.request(route, {
        }, function(data) {
            if(data.error) {
                console.log("xiaowa ========= leave fail");
                return;
            }else{
                cc.log(data);
                if (data.code == 0) {
                    cc.director.loadScene("HallScene");
                }else{
                    let alert:Alert = self.alertDialog.getComponent(Alert);
                    alert.showAlert(data.data, function(){
                    }, false);
                }
            }
        });
    }
    // update (dt) {}
}
