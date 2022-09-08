type ProviderAttributes = {
    name: string,
    image: string
}

const providers: { [key: string]: ProviderAttributes } = {
    "aws": {
        name: "Amazon Web Services",
        image: "./img/aws.webp"
    },
    "google": {
        name: "Google Cloud Platform",
        image: "./img/googleCloud.webp"
    },
    "azure": {
        name: "Microsoft Azure",
        image: "./img/azureMicrosoft.webp"
    },
    "do": {
        name: "DigitalOcean",
        image: "./img/digitalOcean.webp"
    },
    "exoscale": {
        name: "Exoscale",
        image: "./img/exoscale.webp"
    },
    "ovh": {
        name: "OVH",
        image: "./img/ovh.webp"
    },
    "upcloud": {
        name: "UpCloud",
        image: "./img/upcloud.webp"
    },
    "vultr": {
        name: "Vultr",
        image: "./img/vultr.webp"
    }
}

export const getCloudProvider = (name: string): ProviderAttributes => providers[name] || { name, image: "./img/aiven.jpg" }