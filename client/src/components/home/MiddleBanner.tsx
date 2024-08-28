import exclamationMarkCat2 from "../../assets/img/exclamationMarkCat2.png";

const MiddleBanner = () => {
  return (
    <section className="middelBenner-container">
      <div className="text-container">
        <span>동네 집사님들의 관심이 필요합니다.</span>
        <span>실종 고양이 게시판에서 자세한 내용을 확인해보세요.</span>
        <img src={exclamationMarkCat2} alt="exclamationMarkCat2" />
      </div>
    </section>
  );
};

export default MiddleBanner;
