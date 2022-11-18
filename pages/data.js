import Head from 'next/head';
import { getSession } from 'next-auth/react';
import { MultiSelect } from "react-multi-select-component";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js';
import { LinearScale, CategoryScale, BarElement, Title, Tooltip} from 'chart.js';

import Footer from "../components/layout/footer";
import Header from "../components/layout/header";
import Headersep from "../components/layout/header_sep"
import { useEffect, useState } from 'react';
import Buttonwait from '../components/buttonwait';

export default function data(props) {

    //instantiate variables

    const [loading, setLoading] = useState(true)

    const [ ageMin, setAgeMin ] = useState(0)
    const [ ageMax, setAgeMax ] = useState(100)
    const [ expMin, setExpMin ] = useState(0)
    const [ expMax, setExpMax ] = useState(99)  

    const [fromExp, setFromExp] = useState(expMin)
    const [toExp, setToExp] = useState(expMax)
    const [fromAge, setFromAge] = useState(ageMin)
    const [toAge, setToAge] = useState(ageMax)

    const [countries_opt, setCountries] = useState([])
    const [cSelected, setCSelected] = useState([])
    const [sectors_opt, setSectors] = useState([])
    const [sSelected, setSSelected] = useState([])
    const sex_opt = [
        { label:'Female', value:'Female' },
        { label:'Male', value:'Male' },
        { label:'Other', value:'Other' },
    ]
    const [sexSel, setSexSel] = useState(sex_opt)
    const edu_opt = [
        { label:'Apprenticeship', value:'Apprenticeship' },
        { label:'High School', value:'High School' },
        { label:'Bachelor', value:'Bachelor' },
        { label:'Master', value:'Master' },
        { label:'PhD', value:'PhD' },
    ]
    const [eduSel, setEduSel] = useState(edu_opt)

    const [profiles_json, setPJSON] = useState([])

    const [scores_json, setSJSON] = useState([])

    const [avg_score, setAvg] = useState([])
    const [noScores, setNoScores] = useState(false)

    ChartJS.register(BarElement, LinearScale, CategoryScale, Tooltip, Title)

    const options = {
        scale: {
            min: 0,
            max: 100,
            stepSize: 10,
        },
        ticks: {
            color:'#283747'

        },
        responsive: true,
        mantainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Average scores (filtered)',
            color: '#283747',
            font: {
                family: 'Rubik',
                size: 20
              }
          },
        },
      }

    const labels = [
        'Team Culture',
        'Vision & Planning', 
        'Team Collaboration', 
        'Product',
        'Team Performance',
        'Leadership'
    ]

    useEffect(()=>{
        const fetchData = async () => {
            //fetch profile and score data
            try {
                const body = { }
                const response = await fetch('api/retrievedata', {
                    method:'PUT',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify(body),
                })
                
                const res = await response.json()
                const profiles_json_temp = res.profiles
                setPJSON(profiles_json_temp)
                const scores_json_temp = res.scores
                setSJSON(scores_json_temp)
                const to_from = res.to_from

                const from = to_from._min
                const to = to_from._max

                //update filter variables with actual data, e.g. minimum age, available sectors, ...

                setAgeMin(String(from.age))
                setAgeMax(String(to.age))
                setExpMin(String(from.experience))
                setExpMax(String(to.experience))

                setFromAge(String(from.age))
                setToAge(String(to.age))
                setFromExp(String(from.experience))
                setToExp(String(to.experience))

                let countries = [], sectors = []

                profiles_json_temp.map((p) => (
                    countries.push(p.country)
                ))
                profiles_json_temp.map((p) => (
                    sectors.push(p.field)
                ))

                countries = new Set(countries)
                countries = Array.from(countries).sort()
                sectors = new Set(sectors)
                sectors = Array.from(sectors).sort()

                const countries_opt_temp = [] 

                countries.map((c)=>(
                    countries_opt_temp.push({ label:c, value:c })
                ))

                const sectors_opt_temp = []

                sectors.map((s)=>(
                    sectors_opt_temp.push({ label:s, value:s })
                ))

                setLoading(false)
                
                setCountries(countries_opt_temp)
                setCSelected(countries_opt_temp)

                setSectors(sectors_opt_temp)
                setSSelected(sectors_opt_temp)  
                
            } catch (error) {
                console.error(error)
                document.getElementById('no-conf-msg').classList.remove('w3-hide')
                document.getElementById('data-loading').classList.add('w3-hide')
            }
        }
        fetchData()
    },[])

    function handleFiltering() {
        let agefrom, ageto, expfrom, expto

        if (!loading) {
            //get slider filter inputs
            agefrom = parseInt(document.getElementById('agefrom').value)
            ageto = parseInt(document.getElementById('ageto').value)
            expfrom = parseInt(document.getElementById('expfrom').value)
            expto = parseInt(document.getElementById('expto').value)

            //switch if from filter gets bigger than to
            if (agefrom > ageto) {
                let agetemp = agefrom
                agefrom = ageto
                ageto = agetemp
            }
            
            if (expfrom > expto) {
                let exptemp = expfrom
                expfrom = expto
                expto = exptemp
            }
        }

        const country = cSelected.map(c => c.value)
        const sector = sSelected.map(s=> s.value)
        const gender = sexSel.map(g => g.value)
        const education = eduSel.map(e => e.value)

        const filters = {
            country: cSelected,
            sector: sSelected,
            education: education,
            gender: sexSel,
            age: [agefrom, ageto],
            exp: [expfrom, expto]
        }

        if (!loading) {
            //filter profiles
            const profiles_filtered = profiles_json
               .filter(p => gender.includes(p.sex))
               .filter(p=> education.includes(p.education))
               .filter(p=> country.includes(p.country))
               .filter(p=> sector.includes(p.field))
               .filter(p => (p.age <= ageto) && (p.age >= agefrom))
               .filter(p => p.experience <= expto && p.experience >= expfrom)

            //extract ids of filtered profiles and obtain filtered scores
            let id_version = []

            profiles_filtered.map(p => id_version.push(p.user_id+'_'+p.version))

            const scores_filtered = scores_json
            .filter(s => id_version.includes(s.user_id+'_'+s.profile_version))

            let tcu = [], vis = [], tco = [], pro = [], tpe = [],  lea = []

            scores_filtered.map( s => (
                tcu.push(s.tcu),
                vis.push(s.vis),
                tco.push(s.tco),
                pro.push(s.pro),
                tpe.push(s.tpe),
                lea.push(s.lea)
                ))

            //get average of filtered scores

            function avg(arr) {
                var avg = arr.reduce((a, b) => a + b, 0) / arr.length
                avg = Math.round(avg)
                return avg
            }           
            
            setAvg([
                avg(tcu),
                avg(vis),
                avg(tco),
                avg(pro),
                avg(tpe),
                avg(lea),
            ])

            if (scores_filtered.length==0){
                setNoScores(true)
            } else {
                setNoScores(false)
            }
        }
    }

    function handleExpSlider(e) {
        //extract values to color slider selection
        const from_value = document.getElementById('expfrom').value
        const to_value = document.getElementById('expto').value

        if (parseInt(from_value) <= parseInt(to_value)) {
            setFromExp(from_value)
            setToExp(to_value)
            fillSlider(from_value, to_value, true)
        } else {
            setFromExp(to_value)
            setToExp(from_value)
            fillSlider(to_value, from_value, true)
        }
    }

    function handleToExpSlider(e) {
        //update slider if number cells are modified
        const newFrom = document.getElementById('exp-number-from').value
        setFromExp(newFrom)
        document.getElementById('expfrom').value = newFrom

        const newTo = document.getElementById('exp-number-to').value
        setToExp(newTo)
        document.getElementById('expto').value = newTo

        handleExpSlider(e)
    }

    function handleAgeSlider(e) {
        //extract values and trigger slider filling
        const from_value = document.getElementById('agefrom').value
        const to_value = document.getElementById('ageto').value

        if (parseInt(from_value) <= parseInt(to_value)) {
            setFromAge(from_value)
            setToAge(to_value)
            fillSlider(from_value, to_value, false)
        } else {
            setFromAge(to_value)
            setToAge(from_value)
            fillSlider(to_value, from_value, false)
        }
    }

    function handleToAgeSlider(e) {
        //update slider if number cells are modified
        const newFrom = document.getElementById('age-number-from').value
        setFromAge(newFrom)
        document.getElementById('agefrom').value = newFrom

        const newTo = document.getElementById('age-number-to').value
        setToAge(newTo)
        document.getElementById('ageto').value = newTo

        handleAgeSlider(e)
    }

    function fillSlider(from, to, exp) {
        //color slide selection based on given colors
        const rangeColor = '#283747'

        if (exp) {
            const rangeDistance = expMax - expMin
            const fromPosition = from - expMin
            const toPosition = to - expMin

            const grad_txt = 'linear-gradient(to right, white 0% ,'+
            'white ' + (fromPosition)/(rangeDistance)*100 + '%, ' +
            rangeColor + ' ' + (fromPosition)/(rangeDistance)*100 + '%, ' +
            rangeColor + ' ' + (toPosition)/(rangeDistance)*100 + '%, ' +
            'white ' + toPosition/rangeDistance*100 + '%, ' +
            'white 100%)'

            document.getElementById('expto').style.background = grad_txt
        } else {
            const rangeDistance = ageMax - ageMin
            const fromPosition = from - ageMin
            const toPosition = to - ageMin

            const grad_txt = 'linear-gradient(to right, white 0% ,'+
            'white ' + (fromPosition)/(rangeDistance)*100 + '%, ' +
            rangeColor + ' ' + (fromPosition)/(rangeDistance)*100 + '%, ' +
            rangeColor + ' ' + (toPosition)/(rangeDistance)*100 + '%, ' +
            'white ' + toPosition/rangeDistance*100 + '%, ' +
            'white 100%)'

            document.getElementById('ageto').style.background = grad_txt
        }
    }

    //trigger filtering when multi-select components are modified
    useEffect(()=>{
        handleFiltering()
    }, [cSelected]);
    useEffect(() => {
        handleFiltering()
    }, [sSelected]);
    useEffect(() => {
        handleFiltering()
    }, [sexSel]);
    useEffect(() => {
        handleFiltering()
    }, [eduSel]);

    function handleReset(e) {
        //reset filters
        e.preventDefault()
        document.getElementById('profiles-filtering').reset()
        handleAgeSlider(e)
        handleExpSlider(e)
        setSSelected(sectors_opt)
        setCSelected(countries_opt)
        setEduSel(edu_opt)
        setSexSel(sex_opt)
        handleFiltering(e)
    }

    return(

        <div className = 'page'>
            
            <Head>
                <title>Data | Agility Hub</title>
            </Head>
            <Header session={props.data} />

            <div id = 'data'>
                
                <Headersep />

                <div id = 'no-conf-msg' className='normal-text w3-hide'>
                    A server side error occurred and the data could not be loaded, please try again later.
                </div>

                {loading
                ?<div id = 'data-loading' className='normal-text' style={{fontFamily:'Rubikmed'}}>
                    <Buttonwait color={'#283747'} show={true} nomargin={true}/>
                    <br />
                    Loading
                </div>
                :<div id='data-frame' className='normal-text'>
                    <div className='title w3-hide-small' id='data-title'> 
                        Explore the data
                    </div>
                    <div className='title w3-hide-medium w3-hide-large' style={{marginBottom:'2.5vh'}}> 
                        Explore the data
                    </div>
                    <form onChange={handleFiltering} id='profiles-filtering' onKeyDown={(e)=>{if (e.key == 'Enter'){e.preventDefault()}}}>
                        <div className='w3-row'>
                        <fieldset className='w3-col l4 m6 fs-sel'>
                            <legend>Country</legend>
                            <MultiSelect
                                options={countries_opt}
                                value={cSelected}
                                onChange={setCSelected}
                                labelledBy="Select"
                            />
                        </fieldset>
                        <fieldset className='w3-col l4 m6 fs-sel'>
                            <legend>Sector</legend>
                            <MultiSelect
                                options={sectors_opt}
                                value={sSelected}
                                onChange={setSSelected}
                                labelledBy="Select"
                            />
                        </fieldset>
                        <fieldset id='edu-set' className='w3-col l4 m6 fs-sel'>
                            <legend>Education </legend>
                            <MultiSelect
                                options={edu_opt}
                                value={eduSel}
                                onChange={setEduSel}
                                labelledBy="Select"
                            />
                        </fieldset>
                        <fieldset id='exp-set' className='w3-col l4 m6'>
                            <legend> Years of Experience </legend>
                            <input type='number' id='exp-number-from' value={fromExp} min={expMin} max={toExp} className='number normal-text' onChange={handleToExpSlider}/>
                            <div className='slider-control'>
                                <input type="range" id='expfrom' defaultValue= {expMin} min={expMin} max={expMax} className='slider' onChange={handleExpSlider}/>
                                <input type="range" id='expto' defaultValue= {expMax} min={expMin} max={expMax} className='slider' onChange={handleExpSlider}/>
                            </div>
                            <input type='number' id= 'exp-number-to' value={toExp} min={fromExp} max={expMax} className='number normal-text' onChange={handleToExpSlider}/>                            
                        </fieldset>
                        <fieldset id='age-set' className='w3-col l4 m6'>
                            <legend> Age </legend>
                            <input type='number' id='age-number-from' value={fromAge} min={ageMin} max={toAge} className='number normal-text' onChange={handleToAgeSlider}/>
                            <div className='slider-control'>
                                <input type="range" id='agefrom' defaultValue= {ageMin} min={ageMin} max={ageMax} className='slider' onChange={handleAgeSlider}/>
                                <input type="range" id='ageto' defaultValue= {ageMax} min={ageMin} max={ageMax} className='slider' onChange={handleAgeSlider}/>
                            </div>
                            <input type='number' id= 'age-number-to' value={toAge} min={fromAge} max={ageMax} className='number normal-text nr' onChange={handleToAgeSlider}/>
                        </fieldset>
                        <fieldset id='sex-set' className='w3-col l4 m6 fs-sel'>
                            <legend>Gender</legend>
                            <MultiSelect
                                options={sex_opt}
                                value={sexSel}
                                onChange={setSexSel}
                                labelledBy="Select"
                            />
                        </fieldset>  
                        </div>  
                        <br/>
                        <button onClick={handleReset} className='w3-col l2 m3 s12 normal-btn w3-padding' id='filter-reset'>
                            Reset all filters &nbsp;<span style={{fontWeight:'bolder'}}>&#8634;</span>
                        </button>                    
                    </form>
                    <div id = 'avg-chart-container' className='w3-col l8 m10'>
                        {!noScores
                        ?<Bar 
                            options = {options} 
                            data = {{ labels, 
                                datasets: [{
                                    data: avg_score, 
                                    backgroundColor: 
                                    ['rgb(255, 0, 41)',
                                    'rgb(55, 126, 184)',
                                    'rgb(102, 166, 30)',
                                    'rgb(152, 78, 163)',
                                    'rgb(0, 210, 213)',
                                    'rgb(255, 127, 0)']}] }}
                            />
                        :<div>No scores</div>
                }
                    </div>                                    
                </div>
                }
            </div>
            <Footer />
        </div>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)

    return {
        props: { data: session}
      }
}