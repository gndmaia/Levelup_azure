import { Question } from '@/types';

// AZ-900 Azure Fundamentals exam questions
// This file is independent from AI-900 questions

interface RawQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string | string[];
  type: string;
  explanation?: string;
  documentationUrl?: string;
}

function determineObjective(question: string, explanation: string = ''): string {
  const text = (question + ' ' + explanation).toLowerCase();
  
  // Describe Cloud Concepts (25-30%)
  if (text.includes('cloud computing') || text.includes('cloud model') || text.includes('cloud service') ||
      text.includes('iaas') || text.includes('paas') || text.includes('saas') || 
      text.includes('infrastructure as a service') || text.includes('platform as a service') || text.includes('software as a service') ||
      text.includes('public cloud') || text.includes('private cloud') || text.includes('hybrid cloud') ||
      text.includes('serverless') || text.includes('consumption') || text.includes('capex') || text.includes('opex') ||
      text.includes('scalability') || text.includes('elasticity') || text.includes('agility') || text.includes('fault tolerance') ||
      text.includes('disaster recovery') || text.includes('high availability') || text.includes('shared responsibility')) {
    return 'Cloud-Concepts';
  }
  
  // Describe Azure Architecture and Services (35-40%)
  if (text.includes('region') || text.includes('availability zone') || text.includes('resource group') || text.includes('subscription') || text.includes('management group') ||
      text.includes('virtual machine') || text.includes('vm') || text.includes('app service') || text.includes('container') || text.includes('azure functions') || text.includes('aks') || text.includes('azure kubernetes') ||
      text.includes('azure storage') || text.includes('blob') || text.includes('file share') || text.includes('queue') || text.includes('table storage') || text.includes('disk storage') ||
      text.includes('virtual network') || text.includes('vnet') || text.includes('vpn gateway') || text.includes('express route') || text.includes('dns') ||
      text.includes('azure sql') || text.includes('cosmos db') || text.includes('azure database') || text.includes('synapse') ||
      text.includes('azure marketplace')) {
    return 'Azure-Architecture-Services';
  }
  
  // Describe Azure Management and Governance (30-35%)
  if (text.includes('cost management') || text.includes('pricing calculator') || text.includes('tco calculator') || text.includes('total cost of ownership') ||
      text.includes('azure policy') || text.includes('resource lock') || text.includes('blueprint') || text.includes('governance') ||
      text.includes('azure portal') || text.includes('cloud shell') || text.includes('powershell') || text.includes('cli') || text.includes('azure cli') || text.includes('arm template') || text.includes('azure resource manager') ||
      text.includes('azure monitor') || text.includes('azure advisor') || text.includes('service health') || text.includes('azure arc') ||
      text.includes('sla') || text.includes('service level agreement') || text.includes('service credit')) {
    return 'Management-Governance';
  }
  
  // Security, Privacy, Compliance, and Trust (may overlap with above)
  if (text.includes('security') || text.includes('authentication') || text.includes('authorization') || 
      text.includes('azure active directory') || text.includes('azure ad') || text.includes('entra') || text.includes('microsoft entra') ||
      text.includes('rbac') || text.includes('role-based') || text.includes('mfa') || text.includes('multi-factor') ||
      text.includes('security center') || text.includes('microsoft defender') || text.includes('sentinel') ||
      text.includes('key vault') || text.includes('ddos') || text.includes('firewall') || text.includes('nsg') || text.includes('network security') ||
      text.includes('compliance') || text.includes('gdpr') || text.includes('iso') || text.includes('nist') || text.includes('trust center') || text.includes('privacy') ||
      text.includes('encryption') || text.includes('certificate')) {
    return 'Security-Compliance-Trust';
  }
  
  return 'General';
}

function determineDifficulty(question: string, options: string[]): 'easy' | 'medium' | 'hard' {
  const questionLength = question.length;
  const optionCount = options.length;
  const avgOptionLength = options.reduce((sum, opt) => sum + opt.length, 0) / optionCount;
  
  if (optionCount >= 5) return 'hard';
  if (questionLength > 200 && avgOptionLength > 50) return 'hard';
  if (questionLength > 120 || avgOptionLength > 40) return 'medium';
  return 'easy';
}

function convertQuestion(raw: RawQuestion): Question {
  const options = raw.options.map((text: string, index: number) => ({
    id: String.fromCharCode(65 + index),
    text: text
  }));
  
  let correctOptions: string[];
  if (Array.isArray(raw.correctAnswer)) {
    correctOptions = raw.correctAnswer.map((answer: string) => {
      if (answer.length === 1 && answer >= 'A' && answer <= 'Z') {
        return answer;
      }
      const index = raw.options.findIndex((opt: string) => opt === answer);
      return index >= 0 ? String.fromCharCode(65 + index) : 'A';
    });
  } else {
    if (typeof raw.correctAnswer === 'string' && raw.correctAnswer.length === 1 && raw.correctAnswer >= 'A' && raw.correctAnswer <= 'Z') {
      correctOptions = [raw.correctAnswer];
    } else {
      const index = raw.options.findIndex((opt: string) => opt === raw.correctAnswer);
      correctOptions = [index >= 0 ? String.fromCharCode(65 + index) : 'A'];
    }
  }
  
  return {
    id: raw.id,
    examId: 'AZ-900',
    objectiveId: determineObjective(raw.question, raw.explanation || ''),
    stem: raw.question,
    options: options,
    correctOptions: correctOptions,
    explanation: raw.explanation || 'No explanation provided.',
    references: raw.documentationUrl ? [
      { title: 'Microsoft Documentation', url: raw.documentationUrl }
    ] : [],
    difficulty: determineDifficulty(raw.question, raw.options),
    status: 'published',
    tags: [],
    lastUpdated: new Date().toISOString()
  };
}

const rawQuestions: RawQuestion[] = [
  // Questions will be added here
  // Example placeholder:
  {
    id: "az900_q1",
    question: "What is cloud computing?",
    options: [
      "Delivery of computing services over the internet",
      "A physical server in your datacenter",
      "A type of computer hardware",
      "A networking protocol"
    ],
    correctAnswer: "Delivery of computing services over the internet",
    type: "single",
    explanation: "Cloud computing is the delivery of computing services—including servers, storage, databases, networking, software, analytics, and intelligence—over the Internet (the cloud) to offer faster innovation, flexible resources, and economies of scale.",
    documentationUrl: "https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/get-started/what-is-azure"
  }
,
  {
    id: 'az900-1',
    question: "Which two attributes are characteristics of the private cloud deployment model? Each correct answer presents a complete solution. Select all answers that apply. Applications can be provisioned and deprovisioned quickly. This answer is incorrect. Hardware must be purchased. This answer is correct. Organizations only pay for what they use. This answer is incorrect. The company has complete control over physical resources and security. This answer is correct.",
    options: ["Applications can be provisioned and deprovisioned quickly.","Hardware must be purchased.","Organizations only pay for what they use.","The company has complete control over physical resources and security."],
    correctAnswer: ['B', 'D'],
    type: 'multiple',
    explanation: "In a private cloud, hardware must be purchased for start up and maintenance. In a private cloud, organizations control resources and security. Quick provisioning is a characteristic of the public cloud deployment model. Paying only for what is used is a characteristic of the public cloud deployment model.",
    documentationUrl: "",
  }
,
  {
    id: 'az900-2',
    question: "What are two characteristics of a consumption-based model? Each correct answer presents a complete solution. Select all answers that apply. high capital expenditures no upfront costs This answer is correct. requires the purchase and management of the physical infrastructure the ability to stop paying for resources that are no longer used This answer is correct.",
    options: ["high capital expenditures","no upfront costs","requires the purchase and management of the physical infrastructure","the ability to stop paying for resources that are no longer used"],
    correctAnswer: ['B', 'D'],
    type: 'multiple',
    explanation: "In a consumption-based model, you do not pay for anything until you start using resources, and you only pay for what you use. If you stop using a resource, you stop paying for it. High expenditures are usually associated with the purchase of the physical infrastructure, which is not needed in a consumption-based model.",
    documentationUrl: "",
  }
,
  {
    id: 'az900-3',
    question: "Which two characteristics are common advantages of cloud computing? Each correct answer presents a complete solution. Select all answers that apply. elimination of horizontal scaling geo-distribution This answer is correct. high availability This answer is correct. physical access to servers",
    options: ["elimination of horizontal scaling","geo-distribution","high availability","physical access to servers"],
    correctAnswer: ['B', 'C'],
    type: 'multiple',
    explanation: "Cloud-based apps can provide a continuous user experience with no apparent downtime, even when things go wrong. You can deploy apps and data to regional datacenters around the globe, thereby ensuring that your customers always have the best performance in their region. Apps in cloud computing can scale vertically and horizontally. In a public cloud model, you do not get physical access to servers, as they are managed by the cloud provider.",
    documentationUrl: "",
  }
,
  {
    id: 'az900-4',
    question: "Which cloud deployment model are you using if you have servers physically located at your organization’s on-site datacenter, and you migrate a few of the servers to the cloud? Select only one answer.",
    options: ["hybrid cloud","private cloud","public cloud"],
    correctAnswer: 'A',
    type: 'single',
    explanation: "A hybrid cloud is a computing environment that combines a public cloud and a private cloud by allowing data and applications to be shared between them.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-cloud-compute/",
  }
,
  {
    id: 'az900-5',
    question: "What are cloud-based backup services, data replication, and geo-distribution features of? Select only one answer. a cost reduction plan",
    options: ["a disaster recovery plan","a hybrid cloud deployment","an elastic application configuration"],
    correctAnswer: 'A',
    type: 'single',
    explanation: "Disaster recovery uses services, such as cloud-based backup, data replication, and geo-distribution, to keep data and code safe in the event of a disaster.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-benefits-use-cloud-services/",
  }
,
  {
    id: 'az900-6',
    question: "What is an Azure Storage account named storage001 an example of? Select only one answer.",
    options: ["a resource","a resource group","a resource manager","a subscription"],
    correctAnswer: 'A',
    type: 'single',
    explanation: "A resource is a manageable item that is available through Azure. Virtual machines, storage accounts, web apps, databases, and virtual networks are examples of resources.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-core-architectural-components-of-azure/",
  }
,
  {
    id: 'az900-7',
    question: "Which Azure component allows you to replicate resources across a geography to ensure business continuity during a natural disaster at the primary site? Select only one answer.",
    options: ["availability sets","availability zones","Azure Virtual Machine Scale Sets","region pairs"],
    correctAnswer: 'D',
    type: 'single',
    explanation: "Region pairs allow the replication of Azure resources across geographies to help ensure that a secondary region is available in case of any disaster at the primary region.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-core-architectural-components-of-azure/",
  }
,
  {
    id: 'az900-8',
    question: "Which two Azure resources can make use of availability zones? Each correct answer presents a complete solution. Select all answers that apply.",
    options: ["Azure SQL databases","Azure subscriptions","resource groups","virtual machines"],
    correctAnswer: ['A', 'D'],
    type: 'multiple',
    explanation: "Availability zones are primarily for virtual machines, managed disks, load balancers, and SQL databases.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-core-architectural-components-of-azure/",
  }
,
  {
    id: 'az900-9',
    question: "What can you use to execute code in a serverless environment? Select only one answer.",
    options: ["Azure Container Instances","Azure Functions","Azure Logic Apps","Azure Virtual Desktop"],
    correctAnswer: 'B',
    type: 'single',
    explanation: "Azure Functions allows you to run code as a service without having to manage the underlying platform or infrastructure. Azure Logic Apps is similar to Azure Functions, but uses predefined workflows instead of developing your own code.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-azure-compute-networking-services/",
  }
,
  {
    id: 'az900-10',
    question: "Which scenario is a use case for a VPN gateway?",
    options: ["communicating between Azure resources","connecting an on-premises datacenter to an Azure virtual network","filtering outbound network traffic","partitioning a virtual network's address space"],
    correctAnswer: 'B',
    type: 'single',
    explanation: "A VPN gateway is a type of virtual network gateway. Azure VPN Gateway instances are deployed to a dedicated subnet of a virtual network. You can use them to connect on-premises datacenters to virtual networks through a Site-to-Site (S2S) VPN connection.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-azure-compute-networking-services/",
  }
,
  {
    id: 'az900-11',
    question: "You need to allow resources on two different Azure virtual networks to communicate with each other. What should you configure? Select only one answer.",
    options: ["a network security group (NSG)","a point-to-site VPN","peering","service endpoints"],
    correctAnswer: 'C',
    type: 'single',
    explanation: "You can link virtual networks together by using virtual network peering. Peering enables resources in each virtual network to communicate with each other.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-azure-compute-networking-services/",
  }
,
  {
    id: 'az900-12',
    question: "Which two services can you use to establish network connectivity between an on-premises network and Azure resources? Each correct answer presents a complete solution. Select all answers that apply.",
    options: ["Azure Bastion","Azure Firewall","Azure VPN Gateway","ExpressRoute"],
    correctAnswer: ['C', 'D'],
    type: 'multiple',
    explanation: "ExpressRoute connections and Azure VPN Gateway are two services that you can use to connect an on-premises network to Azure. Bastion provides a web interface to remotely administer Azure virtual machines by using SSH/RDP. Azure Firewall is a stateful firewall service used to protect virtual networks.",
    documentationUrl: "https://learn.microsoft.com/azure/expressroute/expressroute-connectivity-models",
  }
,
  {
    id: 'az900-13',
    question: "What can you use to provide Mac and Android users with access to a Windows environment that will run Windows-based applications? Select only one answer.",
    options: ["Azure Container Instances","Azure Functions","Azure Logic Apps","Azure Virtual Desktop"],
    correctAnswer: 'D',
    type: 'single',
    explanation: "Azure Virtual Desktop is a desktop and application virtualization service that runs in the cloud. It enables your users to use a cloud-hosted version of Windows from any location. Azure Virtual Desktop works across devices such as Windows, Mac, iOS, Android, and Linux. It works with apps that you can use to access Remote Desktops and apps. You can also use most modern browsers to access Azure Virtual Desktop-hosted experiences.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-azure-compute-networking-services/",
  }
,
  {
    id: 'az900-14',
    question: "What are two services that allow you to run applications in containers? Each correct answer presents a complete solution. Select all answers that apply.",
    options: ["Azure Container Instances","Azure Functions","Azure Logic Apps","Azure Kubernetes Service (AKS)"],
    correctAnswer: ['A', 'D'],
    type: 'multiple',
    explanation: "Containers are a virtualization environment. Much like running multiple virtual machines on a single physical host, you can run multiple containers on a single physical or virtual host. Unlike virtual machines, you do not manage the operating system for a container.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-azure-compute-networking-services/",
  }
,
  {
    id: 'az900-15',
    question: "Which Azure Blob storage tier stores data offline and offers the lowest storage costs and the highest costs to access data? Select only one answer.",
    options: ["Archive","Cool","Hot"],
    correctAnswer: 'A',
    type: 'single',
    explanation: "The Archive storage tier stores data offline and offers the lowest storage costs, but also the highest costs to rehydrate and access data. The Hot storage tier is optimized for storing data that is accessed frequently. Data in the Cool access tier can tolerate slightly lower availability, but still requires high durability, retrieval latency, and throughput characteristics similar to hot data.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-azure-storage-services/",
  }
,
  {
    id: 'az900-16',
    question: "Which Azure Storage service should you use to store unstructured files, such as images, that will be served on webpages? Select only one answer.",
    options: ["Azure Blob storage","Azure Disk Storage","Azure Queue Storage","Azure Table storage"],
    correctAnswer: 'A',
    type: 'single',
    explanation: "Azure Blob storage is an object storage solution that you can use to store massive amounts of unstructured data, such as text or binary data.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-azure-storage-services/",
  }
,
  {
    id: 'az900-17',
    question: "Which Azure Storage service should you use to store unstructured files, such as images, that will be served on webpages? Select only one answer.",
    options: ["Azure Blob storage","Azure Disk Storage","Azure Queue Storage","Azure Table storage"],
    correctAnswer: 'A',
    type: 'single',
    explanation: "Azure Blob storage is an object storage solution that you can use to store massive amounts of unstructured data, such as text or binary data.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-azure-storage-services/",
  }
,
  {
    id: 'az900-18',
    question: "What can you use to ensure that a user can only access applications from compliant devices? Select only one answer.",
    options: ["Conditional Access","hybrid identity","multi-factor authentication (MFA)","single sign-on (SSO)"],
    correctAnswer: 'A',
    type: 'single',
    explanation: "Conditional Access is a feature that Microsoft Entra uses to allow or deny access to resources based on identity signals, such as the device being used. SSO enables a user to sign in one time and use that credential to access multiple resources and applications from different providers. MFA is a process whereby a user is prompted during the sign-in process for an additional form of identification. Hybrid identity solutions create a common user identity for authentication and authorization to all resources, regardless of location.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-azure-identity-access-security/",
  }
,
  {
    id: 'az900-19',
    question: "To which object or level is an Azure role-based access control (RBAC) role applied? Select only one answer.",
    options: ["policy","resource lock","resource tag","scope"],
    correctAnswer: 'D',
    type: 'single',
    explanation: "An Azure RBAC role is applied to a scope, which is a resource or set of resources that the access applies to. Resource locks prevent the accidental change or deletion of a resource. Resource tags are used to locate and act on resources associated with specific workloads, environments, business units, and owners. Policies enforce different rules across resource configurations so that the configurations stay compliant with corporate standards.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-azure-identity-access-security/",
  }
,
  {
    id: 'az900-20',
    question: "Which type of strategy uses a series of mechanisms to slow the advancement of an attack that aims to gain unauthorized access to data? Select only one answer.",
    options: ["defense in depth","distributed denial-of-service (DDoS)","least privileged access","perimeter"],
    correctAnswer: 'A',
    type: 'single',
    explanation: "A defense in depth strategy uses a series of mechanisms to slow the advancement of an attack that aims to gain unauthorized access to data. The principle of least privilege means restricting access to information to only the level that users need to perform their work. A DDoS attack attempts to overwhelm and exhaust an application's resources. The perimeter layer is about protecting an organization's resources from network-based attacks.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-azure-identity-access-security/",
  }
,
  {
    id: 'az900-21',
    question: "What Microsoft Entra feature can you use to configure security authentication that requires users to use their mobile phone to sign in? Select only one answer.",
    options: ["Azure Information Protection (AIP)","Microsoft Defender for Cloud","Microsoft Entra Verified ID","multi-factor authentication (MFA)"],
    correctAnswer: 'D',
    type: 'single',
    explanation: "MFA is the concept of requiring something more than only a password to sign in to an application. You can use the mobile phone to receive a phone call, text, or a code to get authenticated.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-azure-identity-access-security/",
  }
,
  {
    id: 'az900-22',
    question: "Which two services are provided by Microsoft Entra? Each correct answer presents a complete solution. Select all answers that apply.",
    options: ["authentication","data encryption","name resolution","single sign-on (SSO)"],
    correctAnswer: ['A', 'D'],
    type: 'multiple',
    explanation: "Azure AD Microsoft Entra provides services for verifying identity and access to applications and resources. SSO enables you to remember a single username and password to access multiple applications and is available in Azure AD.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-azure-identity-access-security/",
  }
,
  {
    id: 'az900-23',
    question: "Which two services are provided by Microsoft Entra? Each correct answer presents a complete solution. Select all answers that apply.",
    options: ["authentication","data encryption","name resolution","single sign-on (SSO)"],
    correctAnswer: ['A', 'D'],
    type: 'multiple',
    explanation: "Azure ADMicrosoft Entra provides services for verifying identity and access to applications and resources. SSO enables you to remember a single username and password to access multiple applications and is available in Azure AD.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-azure-identity-access-security/",
  }
,
  {
    id: 'az900-24',
    question: "What can you use to ensure that users authenticate by using multi-factor authentication (MFA) when they attempt to sign in from a specific location? Select only one answer.",
    options: ["administrative units","Azure role-based access control (RBAC)","Conditional Access","single sign-on (SSO)"],
    correctAnswer: 'C',
    type: 'single',
    explanation: "Conditional Access can use signals to determine information about authentication attempts, and then determine whether to block access or require additional verifications, such as MFA.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-azure-identity-access-security/",
  }
,
  {
    id: 'az900-25',
    question: "What are two basic services provided by all cloud providers? Each correct answer presents a complete solution. Select all answers that apply.",
    options: ["application development","colocation","compute","storage"],
    correctAnswer: ['C', 'D'],
    type: 'multiple',
    explanation: "All cloud providers provide compute and storage services. Colocation is when a business rents space in a shared physical datacenter. Application development is the responsibility of the customer and is typically done either in-house or through a third party.",
    documentationUrl: "",
  }
,
  {
    id: 'az900-26',
    question: "What is an advantage of cloud computing compared to on-premises deployments?",
    options: ["You can scale more quickly.","You can work from multiple workstations.","You have full access in case of internet outage.","You own your CPUs."],
    correctAnswer: 'A',
    type: 'single',
    explanation: "Cloud computing allows you to scale more quickly. Owning your own CPUs and having full access in the event of an internet outage are not features of cloud computing. Working from multiple workstations is not specific to cloud computing compared to an on-premises deployment.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-cloud-compute/",
  }
,
  {
    id: 'az900-27',
    question: "Select the answer that correctly completes the sentence. [Answer choice] refers to upfront costs incurred one time, such as hardware purchases. Select only one answer.",
    options: ["A consumption-based model","Capital expenditures","Elasticity","Operational expenditures"],
    correctAnswer: 'B',
    type: 'single',
    explanation: "Capital expenditures are one-time expenses that can be deducted over time. Operational expenditures are billed as you use services and a do not have upfront costs.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-cloud-compute/",
  }
,
  {
    id: 'az900-28',
    question: "Which cloud deployment model are you using if you have servers physically located at your organization’s on-site datacenter, and you migrate a few of the servers to the cloud? Select only one answer.",
    options: ["hybrid cloud","private cloud","public cloud"],
    correctAnswer: 'A',
    type: 'single',
    explanation: "A hybrid cloud is a computing environment that combines a public cloud and a private cloud by allowing data and applications to be shared between them.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-cloud-compute/",
  }
,
  {
    id: 'az900-29',
    question: "Select the answer that correctly completes the sentence. Deploying and configuring cloud-based resources quickly as business requirements change is called [answer choice]. Select only one answer.",
    options: ["agility","elasticity","high availability","scalability"],
    correctAnswer: 'A',
    type: 'single',
    explanation: "Agility means that you can deploy and configure cloud-based resources quickly as app requirements change. Scalability means that you can add RAM, CPU, or entire virtual machines to a configuration. Elasticity means that you can configure cloud-based apps to take advantage of autoscaling, so apps always have the resources they need. High availability means that cloud-based apps can provide a continuous user experience with no apparent downtime, even when things go wrong.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-benefits-use-cloud-services/",
  }
,
  {
    id: 'az900-30',
    question: "Select the answer that correctly completes the sentence. Increasing compute capacity for an app by adding instances of resources such as virtual machines is called [answer choice]. Select only one answer.",
    options: ["disaster recovery","high availability","horizontal scaling","vertical scaling"],
    correctAnswer: 'C',
    type: 'single',
    explanation: "Scaling horizontally increases compute capacity by adding instances of resources, such as adding virtual machines to the configuration. You scale vertically by adding RAM or CPUs to a virtual machine. Disaster recovery keeps data and other assets safe in the event of a disaster. High availability minimizes downtime when things go wrong.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-benefits-use-cloud-services/",
  }
,
  {
    id: 'az900-31',
    question: "What are cloud-based backup services, data replication, and geo-distribution features of? Select only one answer.",
    options: ["a cost reduction plan","a disaster recovery plan","a hybrid cloud deployment","an elastic application configuration"],
    correctAnswer: 'B',
    type: 'single',
    explanation: "Disaster recovery uses services, such as cloud-based backup, data replication, and geo-distribution, to keep data and code safe in the event of a disaster.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-benefits-use-cloud-services/",
  }
,
  {
    id: 'az900-32',
    question: "Select the answer that correctly completes the sentence. In cloud computing, [answer choice] allows you to deploy applications to regional datacenters around the world. Select only one answer.",
    options: ["disaster recovery","elasticity","geo-location","high availability"],
    correctAnswer: 'C',
    type: 'single',
    explanation: "You can deploy apps and data to regional datacenters around the globe, thereby ensuring that your customers always have the best performance in their region. This is referred to as geo-distribution.",
    documentationUrl: "https://learn.microsoft.com/en-us/training/modules/describe-benefits-use-cloud-services/",
  }
];

export const seedQuestionsAZ900: Question[] = rawQuestions.map(convertQuestion);
