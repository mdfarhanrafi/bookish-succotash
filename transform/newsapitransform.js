import { getImageUrl } from "../utils/helper.js";

class NewAPiTansform{
    static transform(news) {
        return {
            id: news.id,
            heading: news.title,
            news: news.content,
            image: getImageUrl(news.image),
            reporter: {
                id: news?.user.id,
                name: news?.user.name,
                profile: news?.user?.profile != null ? getImageUrl(news?.user?.profile):null
            }

         }
     }
 
 


}
export default NewAPiTansform