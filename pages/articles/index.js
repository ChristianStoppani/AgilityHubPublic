import Head from 'next/head';
import { getSession } from 'next-auth/react';

import Header from "../../components/layout/header";
import Footer from "../../components/layout/footer";
import Headersep from '../../components/layout/header_sep';
import Article from '../../components/articles/article';

export default function articles_index(props) {

    const articlesFirst = [     
        {
            title:'Agile',
            website:'Boston Consulting Group',
            link:'https://www.bcg.com/capabilities/digital-technology-data/agile',
            summary:'Agile helps organizations move from rigid to resilient, transforming how they get work done. Read about the benefits of agile and how it can spark innovation and growth in the digital age.'
        },
        {
            title:'Embracing Agile',
            website:'Harvard Business Review',
            link:'https://hbr.org/2016/05/embracing-agile',
            summary:'Over the past 25 to 30 years, agile innovation methods have greatly increased success rates in software development, improved quality and speed to market, and boosted the motivation and productivity of IT teams. Now those methods are spreading across a broad range of industries and functions and even reaching into the C-suite. But many executives don’t understand how to promote and benefit from agile; often they manage in ways that run counter to its principles and practices, undermining the effectiveness of agile teams in their organizations.'
        },   
        {
            title:'How to create an agile organization',
            website:'McKinsey & Company',
            link:'https://www.mckinsey.com/business-functions/people-and-organizational-performance/our-insights/how-to-create-an-agile-organization',
            summary:'Transforming companies to achieve organizational agility is in its early days but already yielding positive returns. While the paths can vary, survey findings suggest how to start.'
        },
        {
            title:'Conceptualizing the Agile Work Organization: A systematic literature review, framework and research agenda',
            website:'Greineder M. J., Blohm I., Leicht N., (2020), BLED 2020 Proceedings',
            link:'https://www.alexandria.unisg.ch/255527/',
            summary:'The ongoing discussion of the Agile Work Organization '+
            '(AO) in research and practice permeates a multitude of research '+
            'areas. However, no clear conceptualization of the AO has been '+
            'provided. In this paper, we conduct a Systematic Literature '+
            'Review to investigate what constitutes and defines the AO. '
        },
        {
            title:'Agile Leadership - a comparison of agile leadership styles',
            website:'Greineder M. J., Leicht N., (2020), BLED 2020 Proceedings',
            link:'https://aisel.aisnet.org/bled2020/24',
            summary:'Leadership has been the focus of research in the social sciences since the early 1930s. However, no generally valid theory exists to date. In recent years, theories relating to agile leadership have also increasingly emerged. The aim of this paper is to give an overview of the current state of research on agile leadership.'
        }
    ]
    
    const articlesSecond = [
        {
            title:'Team Effectiveness: Assessment of Team Performance and Learning',
            website:'Himmelfarb Health Sciences Library',
            link:'https://guides.himmelfarb.gwu.edu/teameffectiveness/assessment',
            summary:'Assessment of individual members as well as assessment of the overall team are essential to enhancing teamwork, assessing teams improves goal attainment, enriches relationships, and enhances performance'
        },
        {
            title:'Group feedback for continuous learning',
            website:'London M., Sessa V. I., (2006), Human Resource Development Review',
            link:'https://doi.org/10.1177/1534484306290226',
            summary:'This article explores relationships between feedback, group learning, and performance. It considers how feedback to individuals and the group as a whole supports continuous group learning.'
        },

    ]

    const articlesThird = [
        {
            title:'Design and evaluating a tool for continuously assessing and improving agile practices for increased organisational agility',
            website:'Greineder M. J., Blohm I., Engel C., (2022), ECIS 2022 Research Papers',
            link:'https://www.alexandria.unisg.ch/266668/',
            summary:'Many organizations struggle to measure, control, and manage agility in a manner of continuous '+
            'improvement. Therefore, we draw on Design Science Research to develop and test a tool for '+
            'Continuously Assessing and Improving Agile Practices (CAIAP). CAIAP helps agile practitioners to '+
            'monitor the alignment of “as is” agile practices on individual, team levels with the overall agile strategy '+
            'of the organization.'
        }
    ]
    
    return (
        <div className = 'app-page'>
            
            <Head>
                <title>Articles | Agility Hub</title>
            </Head>

            <Header session={props.data} />
            <Headersep/>

            <div id = 'articles'>
                <div className='page-cont'>
                <div className="title w3-hide-small" id = 'articles-title'>
                    Articles
                </div>

                <div className="title w3-hide-large w3-hide-medium w3-padding-16" id = 'app-title-small'>
                    Articles
                </div> 

                <div id= 'articles-container' className='normal-txt'>
                    <div className='sect-title w3-hide-small'>About Agile</div>
                    <div className='sect-title-s w3-hide-large w3-hide-medium'>About Agile</div>
                    {articlesFirst.map((a)=>(
                        <Article title={a.title} website={a.website} summary={a.summary} link={a.link} key={a.link}/>
                    ))}
                    <br/><br/>
                    <div className='sect-title w3-hide-small'>The importance of feedback and assessments</div>
                    <div className='sect-title-s w3-hide-large w3-hide-medium'>The importance of feedback and assessments</div>
                    {articlesSecond.map((a)=>(
                        <Article title={a.title} website={a.website} summary={a.summary} link={a.link} key={a.link}/>
                    ))}
                    <br/><br/>
                    <div className='sect-title w3-hide-small'>Related work</div>
                    <div className='sect-title-s w3-hide-large w3-hide-medium'>Related work</div>
                    {articlesThird.map((a)=>(
                        <Article title={a.title} website={a.website} summary={a.summary} link={a.link} key={a.link}/>
                    ))}
                </div>
                </div>

                <div id='articles-footer'>
                <Footer />
            </div>
                
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)

    return {
        props: { data: session}
      }
}