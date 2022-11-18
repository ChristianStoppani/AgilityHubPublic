//(e) => {e.target.children[0].classList.remove('w3-hide'); 

export default function Buttonwait(props) {
    const { color, show, nomargin } = props
    var classname
    if (show) {
        classname = 'wait'
    } else {
        classname = 'w3-hide wait'
    }
    var margin
    if(nomargin) {
        margin = '0'
    } else {
        margin = '16px'
    }
    return (
        <div id='wait' className={classname} style={{height:'16px', width: '16px', marginLeft: margin, borderTopColor: color}}/>
    )
}