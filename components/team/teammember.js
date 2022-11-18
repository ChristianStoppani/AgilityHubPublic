import Image from 'next/image'

export default function Teammember(props) {

    var you = ' (you)'

    if(props.leader){
        you = ' (you, leader)'
    }

    const surArray = props.surname.match(/\b(\w)/g)
    surArray.splice(2)

    const initials = props.name[0] + surArray.join('')

    if (props.memberId == props.userId) {
        var surname = props.surname + you
    } else if (props.leader) {
        var surname = props.surname + ' (leader)'
    } else {
        var surname = props.surname
    }

    return (
        <div className="member-frame">
        <div className = 'member-image'>
            {props.picture
            ?<div id='member-image'>
                <Image
                src={props.picture} 
                width='100%'
                height='100%'
                layout="responsive"
                objectFit="cover"
                priority={true}
                />
            </div>
            :null
            }
            {initials}
        </div>
        <div align = 'center' className = 'normal-text member-name'>
            {props.name}{' '}{surname}
        </div>
        </div>
    )

}