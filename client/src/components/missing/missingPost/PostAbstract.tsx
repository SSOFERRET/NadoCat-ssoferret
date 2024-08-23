import { IImage } from "../../../models/image.model";
import ImageCarousel from "../../common/ImageCarousel";
import PostHead from "./PostHead";
import "./../../../styles/scss/components/missing/postAbstract.scss";
import PostSummary from "../common/PostSummary";
import { IMenuList, IMissing } from "../../../models/missing.model";
import { formatDate } from "../../../utils/format/format";

interface IProps {
  post: IMissing;
  navigateUser?: boolean;
  menuList?: IMenuList;
}

const images: IImage[] = [
  {
    url: "/src/assets/img/test.png",
    imageId: 1,
  },
  {
    url: "/src/assets/img/test2.png",
    imageId: 2,
  },
];

const PostAbstract = ({ post, navigateUser, menuList }: IProps) => {
  return (
    <section className="post-abstract">
      <PostHead data={post} navigateUser={navigateUser} menuList={menuList} />
      <ImageCarousel images={images} />
      <PostSummary data={post} />
    </section>
  );
};

export default PostAbstract;
