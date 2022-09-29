import AuthForm from 'components/auth/AuthForm'
import type { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'

const Home: NextPage = () => {
    return (
        <AuthForm />
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (session) {
        return {
            redirect: {
                destination: '/jots',
                permanent: false
            }
        }
    }

    return {
        props: {}
    }
}

export default Home;
