import { IImage } from "../../../models/image.model";
import ImageCarousel from "../../common/ImageCarousel";
import PostHead from "./PostHead";
import "./../../../styles/scss/components/missing/postAbstract.scss";
import PostSummary from "./PostSummary";
import { IMissing } from "../../../models/missing.model";

interface IProps {
  post: IMissing;
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

const PostAbstract = ({ post }: IProps) => {
  return (
    <section className="post-abstract">
      <PostHead data={post} />
      <ImageCarousel images={images} />
      <PostSummary
        time="2024년 8월 10일 오후 4시"
        catDetail="턱시도, 분홍 발바닥, 허스키한 목소리"
        location="서울시 광진구 자양동"
      />
    </section>
  );
};

export default PostAbstract;
