const PageWrapper = ({ children, className }) => {
  return (
    <div className={`py-4 px-5 p-2 md:py-4 md:px-16 ${className || ""}`}>{children}</div>
  )
}
export default PageWrapper

