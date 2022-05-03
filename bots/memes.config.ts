export function memes() {
  return {
    name: 'memes',
    args: `--subreddits TikTokCringe --schedule "0 5,10,15,20 * * *" --insta ${process.env.IG_TEST_USER}:${process.env.IG_TEST_PASS} --tags insta,bollywood,fishing,fyp,instareels,k,trend,likes,feelitreelit,photooftheday,meme,cute,model,foryoupage,post,art,motivation,trendingreels,dance,beautiful,life,rod,feelkaroreelkaro,nature,mancing,bhfyp,reelindia,viralvideos,reelinstagram,reelsviral --explore`,
  };
}
