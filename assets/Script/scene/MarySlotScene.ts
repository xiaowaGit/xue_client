import Slot from "../base/Slot";
import { Image_Slot } from "../utils/tool";
import PutBetIndex from "../base/PutBetIndex";
import SmallGame from "../base/SmallGame";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MarySlotScene extends cc.Component {

    @property(cc.Node)
    node_line: cc.Node = null;

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

    /// slot
    private slot_list:Slot[] = [];

    private slot_y:number = 45;
    private slot_move_x:number = -485/2;

    private put_bet_list:number[] = [900,1800,2700,3600,4500,5400,6300,7200,8100,9000];
    private bet_index:number = 0;
    private put_bet:number = 900;
    // onLoad () {}

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

        // this.small_game.node.active = false;
        this.small_game.init(3);
    }


    set_put_bet(index:number) {
        if (index < 0 || index >= this.put_bet_list.length) return;
        this.put_bet = this.put_bet_list[~~index];
        this.put_bet_index.goto(~~index);
        this.lbl_put_bet.string = "" + this.put_bet;
    }

    /**
     * 开始slot
     */
    start_up() {
        let element_list:Image_Slot[] = [Image_Slot.Image_Banana,Image_Slot.Image_Mango,Image_Slot.Image_Pineapple];
        this.slot_list[0].start_up(element_list,50,4);
        this.slot_list[1].start_up(element_list,50,4.4);
        this.slot_list[2].start_up(element_list,50,4.8);
        this.slot_list[3].start_up(element_list,50,5.2);
        this.slot_list[4].start_up(element_list,50,5.6);
    }

    goto_room() {
        var route = "mary_slot.marySlotHandler.entry";
        pinus.request(route, {
            room_index:1,
        }, function(data) {
            if(data.error) {
                console.log("xiaowa ========= entry fail");
                return;
            }else{
                cc.log(data);
                if (data.code == 0) {

                }
            }
        });
    }
    // update (dt) {}
}
