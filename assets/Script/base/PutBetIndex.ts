/**
 * 押注指示器
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class PutBetIndex extends cc.Component {

    @property(cc.Sprite)
    spr_circular: cc.Sprite = null;

    @property(cc.Sprite)
    spr_index: cc.Sprite = null;

    private static CIRCULAR_MIN:number = 0.16;
    private static CIRCULAR_MAX:number = 0.38;
    private static CIRCULAR_NUM:number = 0.38-0.16;
    private static INDEX_MIN:number = -35;
    private static INDEX_MAX:number = 50;
    private static INDEX_NUM:number = 50-(-35);

    private cell_num:number = null;
    private cell_circular:number = null;
    private cell_index:number = null;

    private current_circular:number = 0;
    private current_index:number = 0;

    private _tick:number = 0;
    start () {

    }

    init(cell_num:number) {
        this.cell_num = cell_num;
        this.cell_circular = PutBetIndex.CIRCULAR_NUM / cell_num;
        this.cell_index = PutBetIndex.INDEX_NUM / cell_num;
        this.goto(0);
    }

    goto(index:number) {
        if (this.cell_num == null) return;
        this.current_circular = index * this.cell_circular + PutBetIndex.CIRCULAR_MIN;
        this.current_index = index * this.cell_index + PutBetIndex.INDEX_MIN;
    }

    update(dt:number) {
        if (this.cell_num == null) return;
        this._tick ++;
        if (this._tick % 4 != 0) return;
        let fillRange:number = this.spr_circular.fillRange;
        let c_fillRange:number = this.current_circular - fillRange;
        this.spr_circular.fillRange = fillRange + c_fillRange/2;
        let rotation:number = this.spr_index.node.rotation;
        let c_rotation:number = this.current_index - rotation;
        this.spr_index.node.rotation = rotation + c_rotation/2;
    }
}
