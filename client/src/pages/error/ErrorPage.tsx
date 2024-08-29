import "../../styles/scss/pages/error/errorPage.scss";
import NotFound from "../../components/error/NotFound";
import HomeCat from "../../components/common/HomeCat";

const ErrorPage = () => {
  return (
    <div className="main-layout">
      <HomeCat />
      <section className="main-container">
        <div className="not-found-page">
          <NotFound />
        </div>
      </section>
    </div>
  );
};

export default ErrorPage;
