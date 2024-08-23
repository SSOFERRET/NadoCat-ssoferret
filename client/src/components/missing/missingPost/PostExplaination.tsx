import "./../../../styles/scss/components/missing/postExplanation.scss";

interface IProps {
  detail: string;
}
const PostExplanation = ({ detail }: IProps) => {
  return (
    <section className="missing-explain">
      <p className="column-key">상세 설명</p>
      <p className="data">{detail}</p>
    </section>
  );
};

export default PostExplanation;
