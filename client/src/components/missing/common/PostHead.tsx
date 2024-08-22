import { IMissing } from "../../../models/missing.model";
import { formatDate } from "../../../utils/format/format";
import Avartar from "../../common/Avartar";
import "./../../../styles/scss/components/missing/postHead.scss";
import { HiOutlineDotsVertical } from "react-icons/hi";

interface IProps {
  data: IMissing;
}

const PostHead = ({ data }: IProps) => {
  const { postId, users, missingCats, createdAt, updatedAt } = data;

  return (
    <section className="missing-post-head" key={postId}>
      <Avartar profileImage={users.profileImage} nickname={users.nickname} />

      <div className="post-title">
        <div className="user-cat-name">
          <p>
            {users.nickname} 님네 {missingCats.name}
          </p>
        </div>
        <div className="created-at">
          <p>{formatDate(createdAt)}</p>
          {createdAt === updatedAt ? null : <p>(수정됨)</p>}
        </div>
      </div>

      <HiOutlineDotsVertical className="options-icon" onClick={() => {}} />
    </section>
  );
};

export default PostHead;
