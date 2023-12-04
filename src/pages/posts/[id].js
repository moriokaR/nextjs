import Layout from "@/components/Layout";
import { getAllPostIds, getPostData } from "@/lib/post";

export async function getStaticPaths() {
    const paths = getAllPostIds();

    return {
        paths,
        // 上のpathsに含まれてないパスだったらページ見つからなくなる
        fallback: false,
    }
}

export async function getStaticProps({ params }) {
    const postData = await getPostData(params.id);

    return {
        props: {
            postData,
        },
    };

}


export default function Post({postData}) {
    return (
        <Layout>
            {postData.title}
            <br></br>
            {postData.date}
            <br></br>
            {postData.blogContentHTML}
        </Layout>
    );
}