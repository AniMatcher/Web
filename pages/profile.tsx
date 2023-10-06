//display existing profile
import * as React from 'react'
import { AspectRatio, Box, Flex, Image, Divider, Text, Card, CardHeader, CardBody, Icon} from '@chakra-ui/react'
import { MdSettings } from 'react-icons/md'
import { AiOutlineUser } from 'react-icons/ai';
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
    const img_size = 125;
    var gender = "Female"
    if(profile.gender == 'M')
    {
        gender = "Male"
    }
    var pref = "He/Him"

    return (
        <Flex flexDirection="column">
            <Flex flexDirection="column" justifyContent={'flex-end'} bg='#530303' height={'200px'} color={'white'}>
                <Flex flexDirection={'row'} justifyContent={"space-between"} alignItems={'flex-end'} gap={50}>
                    {/**profile picture will be obtained through s3 bucket */}
                    <Flex flexDirection={'row'} alignItems={'flex-end'}>
                        <Image 
                        src={"/magflake.jpeg"} 
                        alt='profile picture' 
                        width={150} height={150} 
                        marginRight={2} marginLeft={200} marginBottom={6}/> 
                        <Text marginBottom={6} fontSize={25}>{profile.username}</Text>
                    </Flex>
                    <Flex>
                        <Card bg='white' width={'400px'} marginBottom={6} marginRight={100}>
                                <CardBody>
                                    <Flex flexDirection={'row'} justifyContent={'flex-start'} alignContent={'flex-end'}>
                                        <AiOutlineUser as={MdSettings}/>
                                        <Text colorScheme='blackAlpha' paddingLeft={1}>{gender}</Text>
                                    </Flex>
                                </CardBody>

                            <CardBody>
                                <Text><b>Bio</b></Text>
                                <Divider/>
                                <Text>{profile.bio}</Text>
                            </CardBody>
                        </Card>
                    </Flex>
                </Flex>
                <Flex>

                </Flex>
            </Flex>
            <Flex flexDirection={"column"} justifyContent={'flex-start'} alignItems={'center'}>
                <Text width={'500px'} color={'gray.400'} fontSize={15}><b>My Photos</b></Text>
                <Flex flexDirection={"row"} justifyContent={'center'} alignContent={'center'}>
                    <Image 
                        src={"horimiya.png"} 
                        alt='horimiya' 
                        width={img_size} height={img_size}
                        margin={"5px"} 
                    />
                    <Image 
                        src={"cowboybebop.png"} 
                        alt='cowboybebop' 
                        width={img_size} height={img_size} 
                        margin={"5px"} 
                    />
                    <Image 
                        src={"aot.jpeg"} 
                        alt='aot' 
                        width={img_size} height={img_size} 
                        margin={"5px"} 
                    />
                    <Image 
                        src={"demonslayer.jpeg"} 
                        alt='demonslayer' 
                        width={img_size} height={img_size} 
                        margin={"5px"} 
                    />
                </Flex>
            </Flex>

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


