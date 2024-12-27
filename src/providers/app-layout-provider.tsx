export const AppLayoutProvider = ({ children }: { children: React.ReactNode }) => {
   return (
      <div id="App-Wrapper" className="bg-regular-darkGray-cl">
         {children}
      </div>
   )
}
