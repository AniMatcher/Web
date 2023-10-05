//display existing profile
import * as React from 'react'
import { AspectRatio, Box, Flex, Spacer, Image } from '@chakra-ui/react'
import { useSession } from "next-auth/react"
import { useState } from 'react'
import { useEffect } from 'react'


//user, email, sexual pref, 10 animes you like, genre, profile picture, gender, Recommended Anime
const Page = () => {
    return (
        <Flex flexDirection={"column"}>
            <Box>
                <Image

                />
                <h1>props.</h1>
            </Box>

            <h1>BOOOHOOOO</h1>
        </Flex>
      )
}
const profile = () => {
    const { data , status } = useSession();
    const [profileData, SetProfileData] = useState(null);

    useEffect(() => {
            const getData = async ()=>{
                const url = 'http://127.0.0.1:5000/profile/email/philip.yunfan.yi@gmail.com';
                const query = await fetch(url, {method:'GET', headers:{
                    'Access-Control-Allow-Origin': '*'
                }});
                const response = await query.json();
                console.log("response from API: ", response);
                if (response.status === 200) {
                    const json = await response.json()
                    SetProfileData(json);
                }
            }
            getData();
    }, [profileData]);

    if (status === "authenticated") {
        console.log(profileData);
        return <Page />
    }
    return <a href="/api/auth/signin">Sign in</a>

}

export default profile