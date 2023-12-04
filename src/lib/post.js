import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postDirectory = path.join(process.cwd(), "/src/posts");

// mdファイルのデータを取り出す
export function getPostsData() {
  // // DBからデータ取ってくるときの例
  // const fetchData = await fetch("endpoint");

  // ファイル名のオブジェクトの配列として持つ
  const fileNames = fs.readdirSync(postDirectory);
  // 一つ一つ取り出していく
  const allPostsData = fileNames.map((fileName) => {
    // .mdを取り除く
    const id = fileName.replace(/\.md$/, ""); // ファイル名(id)

    // マークダウンファイルを文字列として読み取る
    const fullPath = path.join(postDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf-8");

    const matterResult = matter(fileContents);

    // idとデータを返す
    return {
      id,
      // タイトル、日付、画像パス
      ...matterResult.data,
    };
  });

  return allPostsData;
}



// getStaticPathでreturnで使うpathを取得する
export function getAllPostIds() {
  // ファイル名のオブジェクトの配列として持つ
  const fileNames = fs.readdirSync(postDirectory);
  return fileNames.map((fileName) => {
    return {
        params: {
            // []の中身と同じにする
            id: fileName.replace(/\.md$/, ""),
        },
    };
  });
  /* これが返ってくる
  [
    {
        params: {
            id: "ssg-ssr"
        }
    },
    {
        params: {
            id: "next-react"
        }
    }
  ]
  */
}

// idに基づいてブログ投稿データを返す。
export async function getPostData(id) {
  const fullPath = path.join(postDirectory, `${id}.md`);
  const fileContent = fs.readFileSync(fullPath, "utf8");

  const matterResult = matter(fileContent);

  const blogContent = await remark().use(html).process(matterResult.content);

  const blogContentHTML = blogContent.toString();

  return {
    id,
    blogContentHTML,
    ...matterResult.data,
  }
}
