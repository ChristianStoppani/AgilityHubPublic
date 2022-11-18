import Image from 'next/image';
import Head from 'next/head';
import { getSession } from 'next-auth/react';

import 'w3-css/w3.css';

import Footer from "../components/layout/footer";
import Header from "../components/layout/header";
import Headersep from "../components/layout/header_sep";

import iwi_logo from "../public/images/iwilogo.png";

export default function about(props) {

    return (

        <div className = 'page'>
            
            <Head>
                <title>About | Agility Hub</title>
            </Head>

            <Header session={props.data} />

            <div id = 'about'>
                
                <Headersep />

                <div id = 'about-content'>
                    <div id = 'about-text' className='w3-col l8 m10 s11'>
                    <h3 align='justify'>
                        Welcome to the Agility Hub!
                    </h3>
                    <p align='justify'>
                        This website is intended as a tool for 
                        teams and individuals to self-assess their level of organisational agility 
                        and access resources on the topic.
                    </p>
                    <p align='justify'>
                        The web application was developed as a bachelor thesis, and revolves around a 
                        questionnaire which was provided by the &nbsp;
                        <a href='https://iwi.unisg.ch/' target='_blank' style={{color:'purple', textDecoration:'underline'}}>
                            Institute for Information Management 
                        </a> at the University of St. Gallen (HSG). 
                    </p>
                    <p align='justify'>
                        What you're seeing and hopefully using now is the first version of it, 
                        which means you're not only a user but also a tester!
                    </p>                
                    </div>
                    <div id='about-img' className='w3-col l8 m10 s11'>
                        <a href = 'https://iwi.unisg.ch/' target = '_blank' id = 'iwi-logo'>
                            <Image
                                src = {iwi_logo}
                                layout="responsive"
                                alt = 'Institut für Wirtschaftsinformatik Logo' 
                                priority={true}
                                />
                        </a>
                    </div>
                </div>
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