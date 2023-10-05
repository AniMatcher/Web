//display existing profile
import * as React from 'react'
import { AspectRatio, Box, Flex, Spacer, Image, Heading, Button } from '@chakra-ui/react'
import { useSession } from "next-auth/react"
import { authOptions } from "./api/auth/[...nextauth]"
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { getServerSession } from "next-auth/next"
import { useState } from 'react'
import { useEffect } from 'react'
import Layout from '../components/layout'
import { useRouter } from 'next/navigation';


//user, email, sexual pref, 10 animes you like, genre, profile picture, gender, Recommended Anime
const Page = ( { profile }: {profile: ProfileProps}) => {
    console.log(profile);
    return (
        <Flex flexDirection={"column"}>
            <Box>
                <h1>{profile.username}</h1>
            </Box>

            <h1>BOOOHOOOO</h1>
        </Flex>
      )
}

type ProfileProps = {
    id: number;
    uuid: string;
    username: string;
    gender: string;
    sex_pref: string;
    genre: string;
    bio: string;
};

export const getServerSideProps = (async (context) => {
    const session = await getServerSession(
        context.req,
        context.res,
        authOptions
      );

      if (session) {    
        const url = `http://127.0.0.1:5000/profile/email/${session.user?.email}`;
        const query = await fetch(url, {method:'GET', headers:{
            'Access-Control-Allow-Origin': '*'
        }});
        if (query.status === 200) {
            const response: ProfileProps = await query.json();
            return { props: { response } }
        } else {
            return {
                redirect: {
                    permanent: false,
                    destination: "/"
                }
            }
        }
        
      } else {
        console.log("NO SESSION????")
        return {
            redirect: {
                permanent: false,
                destination: "/login"
            }
        }
      }
}) satisfies GetServerSideProps<{
    response: ProfileProps
  }>

const profile = ({response} : InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const profile_data : ProfileProps = response;

    return (
                <Page profile={profile_data} />
        );

}



export default profile


