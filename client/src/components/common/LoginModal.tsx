import "../../styles/scss/components/common/loginModal.scss"

const LoginModal = () => {
  return (
    <>
      <div className="login-modal-container">
        <div className="modal-box">
          <span>알림</span>
          <p>
            로그인이 필요합니다. <br/>
            로그인 하시겠습니까?
          </p>
          <div className="btn-box">
            <button>취소</button>
            <button>로그인 하기</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginModal;