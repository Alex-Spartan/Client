const LoginForm = ({ title, children }) => {
  return (
    <div className="h-screen bg-[#F6F4F3] flex items-center justify-center gap-[5rem] overflow-hidden">
      <div className="hidden md:flex-1">
        {/* <img src={img} width={700} alt="" className="h-auto" /> */}
      </div>
      <div className="h-full flex flex-col justify-center items-center flex-1 md:justify-start md:items-end md:mr-[10rem]">
        <div className="px-[4rem] py-[5rem] my-auto bg-[#449DD1] md:px-[5rem] md:py-[5rem] rounded-xl z-1 text-white">
          <h1 className="text-3xl text-center mb-8 font-bold">{title}</h1>
          {children}
        </div>
        
      </div>
    </div>
  )
}

export default LoginForm