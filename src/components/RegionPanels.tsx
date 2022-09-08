import { Cloud } from "../types/apps";
import { RegionDescription } from "./RegionDescription";

type Props = {
    clouds: Cloud[],
    currentCloud: Cloud | null,
    setCurrentCloud: (cloud: Cloud) => void
}

export function RegionPanels({ clouds, currentCloud, setCurrentCloud }: Props) {
    return (<>
        {clouds.map((cloud: Cloud) => (
            <div onClick={() => setCurrentCloud(cloud)} key={cloud.cloud_name + cloud.cloud_description}>
                <RegionDescription
                    isActive={currentCloud === cloud}
                    name={cloud.cloud_name}
                    description={cloud.cloud_description} />
            </div>))}
    </>)
}