export default function Question(props) {

    const {updateCounter} = props

    const handleSelect = (e) => {
        
        const el = e.currentTarget
        const opt = el.classList[1]

        var q_cont = el.closest('.question-container')

        q_cont.classList.add('answered')

        var sel = q_cont.childNodes[1].getElementsByClassName('selected')
        var sel2 = q_cont.childNodes[2].getElementsByClassName('selected')
        
        if ( sel.length != 0) {
            sel[0].classList.remove('selected')
            sel2[0].classList.remove('selected')
        }
        
        const opts = q_cont.getElementsByClassName(opt)

        opts[0].classList.add('selected')
        opts[1].classList.add('selected')

        if (q_cont.nextSibling != null) {
            q_cont.nextSibling.scrollIntoView({behavior:'smooth'})

        }

        updateCounter()
    }


    return (
        <div className = 'question-container' id = {props.id}>

            <p className = 'question-text'>
                {props.text}
            </p>

            <div className = 'options-container w3-hide-medium w3-hide-small' >
                <button onClick = {handleSelect} className = 'option option-1'>
                    {props.opt1}
                </button>

                <button onClick = {handleSelect} className = 'option option-2'>
                    {props.opt2}
                </button>

                <button onClick = {handleSelect} className = 'option option-3'>
                    {props.opt3}
                </button>

                <button onClick = {handleSelect} className = 'option option-4'>
                    {props.opt4}
                </button>

                <button onClick = {handleSelect} className = 'option option-5'>
                    {props.opt5}
                </button>
            </div>

            <div className = 'options-container w3-hide-large' style={{flexDirection:'column'}}>
                <button onClick = {handleSelect} className = 'option-m option-1'>
                    {props.opt1}
                </button>

                <button onClick = {handleSelect} className = 'option-m option-2'>
                    {props.opt2}
                </button>

                <button onClick = {handleSelect} className = 'option-m option-3'>
                    {props.opt3}
                </button>

                <button onClick = {handleSelect} className = 'option-m option-4'>
                    {props.opt4}
                </button>

                <button onClick = {handleSelect} className = 'option-m option-5'>
                    {props.opt5}
                </button>
            </div>
        </div>
    )
}