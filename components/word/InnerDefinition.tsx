export default function InnerDefinition({cssSelector,name}){
    return <div className={`definition ${cssSelector}`}>
        <h4 className="api-name">{name}</h4>
        
    </div>
}