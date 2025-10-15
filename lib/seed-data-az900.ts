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
,
  {
    id: 'az900-33',
    question: "In which two deployment models are customers responsible for managing operating systems that host applications? Each correct answer presents a complete solution. Select all answers that apply.",
    options: ["infrastructure as a service (IaaS)","on-premises","platform as a service (PaaS)","software as a service (SaaS)"],
    correctAnswer: ['A', 'B'],
    type: 'multiple',
    explanation: "Operating systems are managed by customers when using IaaS or an on-premises deployments. The operating systems are not accessible in PaaS and SaaS deployments.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-cloud-service-types/",
  }
,
  {
    id: 'az900-34',
    question: "Which cloud service model provides you with the most control over the hardware that runs applications? Select only one answer.",
    options: ["infrastructure as a service (IaaS)","platform as a service (PaaS)","software as a service (SaaS)"],
    correctAnswer: 'A',
    type: 'single',
    explanation: "IaaS is the most flexible category of cloud services. It aims to give you complete control over the hardware that runs applications. Users do not control the operating system and do not configure the underlying servers in PaaS. With SaaS, you are using as-is software hosted in the cloud, instead of creating a platform to host a software yourself.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-cloud-service-types/",
  }
,
  {
    id: 'az900-35',
    question: "In a platform as a service (PaaS) model, which two components are the responsibility of the cloud service provider? Each correct answer presents a complete solution. Select all answers that apply.",
    options: ["information and data","operating system","physical network","user access"],
    correctAnswer: ['B', 'C'],
    type: 'multiple',
    explanation: "In PaaS, the cloud provider is responsible for the operating system, physical datacenter, physical hosts, and physical network. In PaaS, the customer is responsible for accounts and identities.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-cloud-service-types/",
  }
,
  {
    id: 'az900-36',
    question: "In which cloud service model is the customer responsible for managing the operating system? Select only one answer.",
    options: ["Infrastructure as a service (IaaS)","platform as a service (PaaS)","software as a service (SaaS)"],
    correctAnswer: 'A',
    type: 'single',
    explanation: "IaaS consists of virtual machines and networking provided by the cloud provider. The customer is responsible for the OS and applications. The cloud provider is responsible for the OS in PaaS and SaaS.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-cloud-service-types/",
  }
,
  {
    id: 'az900-37',
    question: "Which type of cloud service are virtual networks? Select only one answer.",
    options: ["infrastructure as a service (IaaS)","platform as a service (PaaS)","software as a service (SaaS)"],
    correctAnswer: 'A',
    type: 'single',
    explanation: "IaaS helps you reduce the cost and complexity of maintaining a physical server and its datacenter infrastructure. Virtual networks are part of the IaaS cloud service.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-cloud-service-types/",
  }
,
  {
    id: 'az900-38',
    question: "Which two factors affect Azure costs? Each correct answer presents a complete solution. Select all answers that apply.",
    options: ["availability zone selection","date and time of use","resource location","resource usage"],
    correctAnswer: ['C', 'D'],
    type: 'multiple',
    explanation: "Usage meters, such as CPU time, disk size, and write operations, are used to calculate your bill for an Azure resource. Deleting or deallocating a resource means that you will no longer be billed for it. Different regions can have different associated prices. Resources cost the same no matter the time of day or the day of the week.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-cost-management-azure/",
  }
,
  {
    id: 'az900-39',
    question: "Which are two common scenarios for using resource tags? Each correct answer presents a complete solution. Select all answers that apply.",
    options: ["associating costs with different environments","categorizing costs by department","identifying lower cost regions","resizing underutilized virtual machines"],
    correctAnswer: ['A', 'B'],
    type: 'multiple',
    explanation: "You can use tags to categorize costs by department, such as human resources, marketing, or finance, or by environment, such as test or production. Resizing underutilized virtual machines is a good cost saving measure and provisioning resources in lower cost regions is a good practice, but resource tags do not help with this.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-cost-management-azure/",
  }
,
  {
    id: 'az900-40',
    question: "You plan to build a new solution in Azure that will use platform as a service (PaaS) products. What should you use to estimate the monthly costs? Select only one answer.",
    options: ["Azure Advisor","Azure Cost Management","Azure Pricing calculator","Total Cost of Ownership (TOC) Calculator"],
    correctAnswer: 'C',
    type: 'single',
    explanation: "The Azure Pricing calculator allows you to estimate and configure according to your specific requirements. You will then receive a consolidated estimated price and a detailed breakdown of the costs associated with each resource you added to your solution.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-cost-management-azure/",
  }
,
  {
    id: 'az900-41',
    question: "Which two features are available by using Azure Cost Management + Billing? Each correct answer presents a complete solution.",
    options: ["Create and manage budgets.","Estimate the total cost of ownership before resources are deployed.","Generate historical reports and forecast future usage.","Provide discounted prices when you pay in advance."],
    correctAnswer: ['A', 'C'],
    type: 'multiple',
    explanation: "Azure Cost Management allows you to create and manage cost and usage budgets by monitoring resource demand trends, consumption rates, and cost patterns. It also allows you to use historical data to generate reports and forecast future usage and expenditures.\n\nhttps://learn.microsoft.com/training/modules/plan-manage-azure-costs/4-purchase-azure-services",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-cost-management-azure/",
  }
,
  {
    id: 'az900-42',
    question: "You need to associate the costs of resources to different groups within an organization without changing the location of the resources. What should you use? Select only one answer.",
    options: ["administrative units","resource groups","resource tags","subscriptions"],
    correctAnswer: 'C',
    type: 'single',
    explanation: "Resource tags can be used to group billing data and categorize costs by runtime environment, such as billing usage for virtual machines running in a production environment.",
    documentationUrl: "https://learn.microsoft.com/azure/azure-resource-manager/management/tag-resources?tabs=json",
  }
,
  {
    id: 'az900-43',
    question: "Your organization plans to deploy several production virtual machines that will have consistent resource usage throughout the year. What can you use to minimize the costs of the virtual machines without reducing the functionality of the virtual machines? Select only one answer.",
    options: ["Azure Monitor alerts","Azure Reservations","spending limits"],
    correctAnswer: 'B',
    type: 'single',
    explanation: "Azure Reservations offers discounted prices on certain Azure services. Azure Reservations can save you up to 72 percent compared to pay-as-you-go prices. To receive a discount, you can reserve services and resources by paying in advance. Spending limits can suspend a subscription when the spend limit is reached.",
    documentationUrl: "https://learn.microsoft.com/training/modules/plan-manage-azure-costs/4-purchase-azure-services",
  }
,
  {
    id: 'az900-44',
    question: "What can you apply to an Azure virtual machine to ensure that users cannot change or delete the resource? Select only one answer.",
    options: ["a lock","a tag","a user-assigned managed identity","Conditional Access"],
    correctAnswer: 'A',
    type: 'single',
    explanation: "A lock –– A resource lock will meet both requirements.",
    documentationUrl: "https://learn.microsoft.com/azure/azure-resource-manager/management/lock-resources?tabs=json",
  }
,
  {
    id: 'az900-45',
    question: "Which feature in the Microsoft Purview governance portal should you use to manage access to data sources and datasets? Select only one answer.",
    options: ["Data Catalog","Data Estate Insights","Data Policy","Data Sharing"],
    correctAnswer: 'C',
    type: 'single',
    explanation: "No explanation provided",
    documentationUrl: "https://learn.microsoft.com/azure/purview/overview",
  }
,
  {
    id: 'az900-46',
    question: "What can you use to ensure that a development team can only create virtual machines of a certain size? Select only one answer.",
    options: ["Azure Blueprints","Azure Policy","Cloud Adoption Framework","Conditional Access"],
    correctAnswer: 'B',
    type: 'single',
    explanation: "Azure Policy enables you to define both individual policies and groups of related policies called initiatives. Azure Policy evaluates your resources and highlights resources that are not compliant with the policies you created. Azure Policy can also prevent noncompliant resources from being created.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-features-tools-azure-for-governance-compliance/",
  }
,
  {
    id: 'az900-47',
    question: "Which management layer accepts requests from any Azure tool or API and enables you to create, update, and delete resources in an Azure account? Select only one answer.",
    options: ["Azure CLI","Azure management groups","Azure Resource Manager (ARM)","Azure Sphere"],
    correctAnswer: 'C',
    type: 'single',
    explanation: "ARM is the deployment and management service for Azure. It provides a management layer that enables you to create, update, and delete resources in an Azure account.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-features-tools-manage-deploy-azure-resources/",
  }
,
  {
    id: 'az900-48',
    question: "Which two tools are accessible via Azure Cloud Shell to manage an Azure environment? Select all answers that apply.",
    options: ["Azure CLI","Azure PowerShell","Azure Repos","Azure Resource Manager (ARM) templates"],
    correctAnswer: ['A', 'B'],
    type: 'multiple',
    explanation: "Azure CLI is an executable program with which a user can execute commands in Bash that call the Azure REST API. Azure Cloud Shell also supports Azure PowerShell as an executable program.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-features-tools-manage-deploy-azure-resources/",
  }
,
  {
    id: 'az900-49',
    question: "What should you use to access Azure Cloud Shell? Select only one answer.",
    options: ["a web browser","Azure Resource Manager (ARM)","Microsoft Visual Studio Code","the command-line on a local computer"],
    correctAnswer: 'A',
    type: 'single',
    explanation: "Cloud Shell is an interactive, browser-accessible shell for managing Azure resources.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-features-tools-manage-deploy-azure-resources/",
  }
,
  {
    id: 'az900-50',
    question: "You have a team of Linux administrators that need to manage the resources in Azure. The team wants to use the Bash shell to perform the administration. What should you recommend? Select only one answer.",
    options: ["Azure Blueprint","Azure CLI","Azure Powershell","Azure Resource Manager (ARM) template"],
    correctAnswer: 'B',
    type: 'single',
    explanation: "Azure CLI allows you to use the Bash shell to perform administrative tasks. Bash is used in Linux environments, so a Linux administrator will probably be more comfortable performing command-line administration from Azure CLI.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-features-tools-manage-deploy-azure-resources/",
  }
,
  {
    id: 'az900-51',
    question: "Which Azure service evaluates Azure resources and makes recommendations to help improve reliability, security, performance, and cost reduction? Select only one answer.",
    options: ["Azure Advisor","Azure Monitor","Azure Service Health","Log Analytics"],
    correctAnswer: 'A',
    type: 'single',
    explanation: "Azure Advisor evaluates Azure resources and makes recommendations to help improve reliability, security, and performance, achieve operational excellence, and reduce costs.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-monitoring-tools-azure/",
  }
,
  {
    id: 'az900-52',
    question: "You need to be notified when there are new recommendations for reducing Azure costs. Which tool should you use? Select only one answer.",
    options: ["Azure Advisor","Azure Monitor","Azure Service Health","Log Analytics"],
    correctAnswer: 'A',
    type: 'single',
    explanation: "Azure Advisor evaluates Azure resources and makes recommendations to help improve reliability, security, and performance, achieve operational excellence, and reduce costs.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-monitoring-tools-azure/",
  }
,
  {
    id: 'az900-53',
    question: "You need to be notified when there are new recommendations for reducing Azure costs. Which tool should you use? Select only one answer. Azure Advisor What should you proactively review and act on to avoid service interruptions, such as service retirements and breaking changes? Select only one answer.",
    options: ["application insights","Azure Monitor","health advisories","service issues"],
    correctAnswer: 'C',
    type: 'single',
    explanation: "Health advisories are issues that require that you take proactive action to avoid service interruptions, such as service retirements and breaking changes. Service issues are problems such as outages that require immediate actions",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-monitoring-tools-azure/",
  }
,
  {
    id: 'az900-54',
    question: "You need to be notified when there are new recommendations for reducing Azure costs. Which tool should you use? Select only one answer. Azure Advisor What should you proactively review and act on to avoid service interruptions, such as service retirements and breaking changes? Select only one answer. application insights What can you use to automatically detect performance anomalies for web apps? Select only one answer.",
    options: ["Azure Advisor","Azure Application Insights","Azure Cognitive Services","Azure DevOps"],
    correctAnswer: 'B',
    type: 'single',
    explanation: "Application Insights is a feature of Azure Monitor that allows you to monitor running applications, automatically detect performance anomalies, and use built-in analytics tools to see what users do on an app",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-monitoring-tools-azure/",
  }
,
  {
    id: 'az900-55',
    question: "What are two characteristics of the public cloud deployment model? Each correct answer presents a complete solution. Select all answers that apply.",
    options: ["Computing resources are used exclusively by users from one organization.","Hardware is physically located in an organization's on-site datacenter.","Servers and storage are owned and operated by a third-party cloud service provider.","Services are offered over the internet and are available to anyone who wants to purchase them."],
    correctAnswer: ['C', 'D'],
    type: 'multiple',
    explanation: "In a public cloud, services are offered over the internet and are available to anyone who wants to purchase them. A private cloud is limited to a single organization. Cloud resources, such as servers and storage, are owned and operated by a third-party cloud service provider and delivered over the internet. A private cloud consists of computing resources used exclusively by users from one business or organization.",
    documentationUrl: "https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/practice/HYPERLINK",
  }
,
  {
    id: 'az900-56',
    question: "Select the answer that correctly completes the sentence. [Answer choice] are physically separate datacenters within an Azure region. Select only one answer.",
    options: ["Availability zones","Geographies","Region pairs","Resource groups"],
    correctAnswer: 'A',
    type: 'single',
    explanation: "Availability zones are physically separate datacenters within an Azure region. Each availability zone is made up of one or more datacenters equipped with independent power, cooling, and networking.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-core-architectural-components-of-azure/",
  }
,
  {
    id: 'az900-57',
    question: "Select the answer that correctly completes the sentence. In a region pair, a region is paired with another region in the same [answer choice]. Select only one answer.",
    options: ["availability zone","datacenter","geography","resource group"],
    correctAnswer: 'C',
    type: 'single',
    explanation: "Each Azure region is always paired with another region within the same geography, such as US, Europe, or Asia, at least 300 miles away.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-core-architectural-components-of-azure/",
  }
  ,
    {
    id: 'az900-58',
    question: "Why is cloud computing often less expensive than on-premises datacenters? Select only one answer.",
    options: ["Cloud service offerings have limited functionality.","Network bandwidth is free.","Services are only offered in a single geographic location.","You are only billed for what you use."],
    correctAnswer: 'D',
    type: 'single',
    explanation: "Renting compute and storage services and being billed for only what you use often lowers operating expenses. Depending on the service and the type of network bandwidth, charges can be incurred. Cloud service offerings often provide functionality that can be difficult or cost-prohibitive to deploy on-premises, especially for smaller organizations. Major cloud providers offer services around the world. Making it easy and relatively inexpensive to deploy services close to where your users reside.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-cloud-compute/",
  }
,
  {
    id: 'az900-59',
    question: "Select the answer that correctly completes the sentence. Increasing compute capacity for an app by adding RAM or CPUs to a virtual machine is called [answer choice]. Select only one answer.",
    options: ["disaster recovery","high availability","horizontal scaling","vertical scaling"],
    correctAnswer: 'D',
    type: 'single',
    explanation: "You scale vertically to increase compute capacity by adding RAM or CPUs to a virtual machine. Scaling horizontally increases compute capacity by adding instances of resources, such as adding virtual machines to the configuration. Disaster recovery keeps data and other assets safe in the event of a disaster. High availability minimizes downtime when things go wrong.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-benefits-use-cloud-services/",
  }
,
  {
    id: 'az900-60',
    question: "Your organization is building a custom application. You need to focus on application development rather than configuration and management of servers. Which cloud service model should you use? Select only one answer.",
    options: ["infrastructure as a service (IaaS)","platform as a service (PaaS)","software as a service (SaaS)"],
    correctAnswer: 'B',
    type: 'single',
    explanation: "With PaaS, users can focus on application development because the cloud provider handles all the platform management. In SaaS, the cloud provider manages all aspects of the application environment, such as virtual machines, networking resources, data storage, and applications. IaaS is the closest service model to managing physical servers.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-cloud-service-types/",
  }
,
  {
    id: 'az900-61',
    question: "Select the answer that correctly completes the sentence. [Answer choice] is the logical container used to combine and organize Azure resources. Select only one answer.",
    options: ["a management group","a resource group","Azure Resource Manager (ARM)","an Azure region"],
    correctAnswer: 'B',
    type: 'single',
    explanation: "Resources are combined into resource groups, which act as a logical container into which Azure resources like web apps, databases, and storage accounts, are deployed and managed.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-core-architectural-components-of-azure/",
  }
,
  {
    id: 'az900-62',
    question: "Select the answer that correctly completes the sentence. [Answer choice] are physically separate datacenters within an Azure region. Select only one answer.",
    options: ["Availability zones","Geographies","Region pairs","Resource groups"],
    correctAnswer: 'A',
    type: 'single',
    explanation: "Availability zones are physically separate datacenters within an Azure region. Each availability zone is made up of one or more datacenters equipped with independent power, cooling, and networking.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-core-architectural-components-of-azure/",
  }
,
  {
    id: 'az900-63',
    question: "Which two components are created in an Azure subscription? Each correct answer presents a complete solution. Select all answers that apply.",
    options: ["Microsoft Entra user accounts","management groups","resource groups","resources"],
    correctAnswer: ['C', 'D'],
    type: 'multiple',
    explanation: "Resources can only be associated with a single subscription. Subscriptions may be grouped into management groups. An account may be associated with multiple subscriptions.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-core-architectural-components-of-azure/",
  }
,
  {
    id: 'az900-64',
    question: "For which resource does Azure generate separate billing reports and invoices by default? Select only one answer.",
    options: ["accounts","management groups","resource groups","subscriptions"],
    correctAnswer: 'D',
    type: 'single',
    explanation: "Azure generates separate billing reports and invoices for each subscription so that you can organize and manage costs. Resource groups can be used to group costs, but you will not receive a separate invoice for each resource group. Management groups are used to efficiently manage access, policies, and compliance for subscriptions. You can set up billing profiles to roll up subscriptions into invoice sections, but this requires customization.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-core-architectural-components-of-azure/",
  }
,
  {
    id: 'az900-65',
    question: "Select the answer that correctly completes the sentence. [Answer choice] is the deployment and management service for Azure. Select only one answer.",
    options: ["Microsoft Entra","Azure API Management","Azure Monitor","Azure Resource Manager (ARM)"],
    correctAnswer: 'D',
    type: 'single',
    explanation: "ARM is the deployment and management service for Azure. It provides a management layer that enables you to create, update, and delete resources in an Azure subscription. You use management features, such as access control, resource locks, and resource tags, to secure and organize resources after deployment.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-core-architectural-components-of-azure/",
  }
,
  {
    id: 'az900-66',
    question: "Which Azure compute service can you use to deploy and manage a set of identical virtual machines? Select only one answer.",
    options: ["availability sets","availability zones","Azure Container Instances","Azure Virtual Machine Scale Sets"],
    correctAnswer: 'D',
    type: 'single',
    explanation: "Virtual Machine Scale Sets are an Azure compute resource that you can use to deploy and manage and scale a set of identical virtual machines.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-azure-compute-networking-services/",
  }
,
  {
    id: 'az900-67',
    question: "Which two scenarios are common use cases for Azure Blob storage? Each correct answer presents a complete solution. Select all answers that apply.",
    options: ["hosting ASPX files for a website","mounting a file storage share to be accessed as a virtual drive on multiple virtual machines","serving images or documents directly to a browser","storing data for backup and restore"],
    correctAnswer: ['C', 'D'],
    type: 'multiple',
    explanation: "Low storage costs and unlimited file formats make blob storage a good location to store backups and archives. Blob storage can be reached from anywhere by using an internet connection. Azure Disk Storage provides disks for Azure virtual machines. Azure Files supports mounting file storage shares.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-azure-storage-services/",
  }
,
  {
    id: 'az900-68',
    question: "Which Azure Blob storage service tier has the highest storage costs and the fastest access times for reading and writing data? Select only one answer.",
    options: ["Archive","Cool","Hot"],
    correctAnswer: 'C',
    type: 'single',
    explanation: "The Hot tier is optimized for storing data that is accessed frequently. The Cool access tier has a slightly lower availability SLA and higher access costs compared to hot data, which are acceptable trade-offs for lower storage costs. Archive storage stores data offline and offers the lowest storage costs, but also the highest costs to rehydrate and access data.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-azure-storage-services/",
  }
,
  {
    id: 'az900-69',
    question: "What can you use to allow a user to manage all the resources in a resource group? Select only one answer.",
    options: ["Azure Key Vault","Azure role-based access control (RBAC)","resource locks","resource tags"],
    correctAnswer: 'B',
    type: 'single',
    explanation: "Azure RBAC allows you to assign a set of permissions to a user or group. Resource tags are used to locate and act on resources associated with specific workloads, environments, business units, and owners. Resource locks prevent the accidental change or deletion of a resource. Key Vault is a centralized cloud service for storing an application secrets in a single, central location.",
    documentationUrl: "https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/",
  }
,
  {
    id: 'az900-70',
    question: "Which type of strategy uses a series of mechanisms to slow the advancement of an attack that aims to gain unauthorized access to data? Select only one answer.",
    options: ["defense in depth","distributed denial-of-service (DDoS)","least privileged access","perimeter"],
    correctAnswer: 'A',
    type: 'single',
    explanation: "A defense in depth strategy uses a series of mechanisms to slow the advancement of an attack that aims to gain unauthorized access to data. The principle of least privilege means restricting access to information to only the level that users need to perform their work. A DDoS attack attempts to overwhelm and exhaust an application's resources. The perimeter layer is about protecting an organization's resources from network-based attacks.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-azure-identity-access-security/",
  }
,
  {
    id: 'az900-71',
    question: "You need to compare the costs of running an application in an on-premises datacenter with the costs of running the application in Azure. What should you use to assist you? Select only one answer.",
    options: ["Azure Advisor","Azure Cost Management","Azure Pricing calculator","Total Cost of Ownership (TCO) Calculator"],
    correctAnswer: 'D',
    type: 'single',
    explanation: "The TCO Calculator helps you estimate the cost savings over time of operating a solution in Azure compared to operating in an on-premises datacenter.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-cost-management-azure/",
  }
,
  {
    id: 'az900-72',
    question: "You have an Azure virtual machine that is accessed only between 9:00 and 17:00 each day. What should you do to minimize costs but preserve the associated hard disks and data?",
    options: ["Deallocate the virtual machine when it is not needed","Delete the virtual machine when it is not needed","Implement Privileged Identity Management.","Resize the virtual machine to smaller size"],
    correctAnswer: 'A',
    type: 'single',
    explanation: "If you have virtual machine workloads that are used only during certain periods, but you run them every hour of every day, then you are wasting money. These virtual machines are great candidates to deallocate when not in use and start back when required to save compute costs while the virtual machines are deallocated.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-cost-management-azure/",
  }
,
  {
    id: 'az900-73',
    question: "What can you use to ensure that new and existing Azure resources stay in compliance with corporate standards? Select only one answer.",
    options: ["Azure Advisor","Azure Policy","resource locks","resource tags"],
    correctAnswer: 'B',
    type: 'single',
    explanation: "Azure Policy is a service in Azure that enables you to create, assign, and manage policies that control or audit resources. These policies enforce different rules across all resource configurations so that the configurations stay compliant with corporate standards.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-features-tools-azure-for-governance-compliance/",
  }
,
  {
    id: 'az900-74',
    question: "What can you use to restrict the deployment of a virtual machine to a specific location? Select only one answer.",
    options: ["Microsoft Defender for Cloud","Azure Policy","resource groups","resource locks"],
    correctAnswer: 'B',
    type: 'single',
    explanation: "Azure Policy can help to create a policy for allowed regions, which enables you to restrict the deployment of virtual machines to a specific location.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-features-tools-azure-for-governance-compliance/3-describe-purpose-of-azure-policy",
  }
,
  {
    id: 'az900-75',
    question: "What can you use to ensure that a development team can only create virtual machines of a certain size? Select only one answer.",
    options: ["Azure Blueprints","Azure Policy","Cloud Adoption Framework","Conditional Access"],
    correctAnswer: 'B',
    type: 'single',
    explanation: "Azure Policy enables you to define both individual policies and groups of related policies called initiatives. Azure Policy evaluates your resources and highlights resources that are not compliant with the policies you created. Azure Policy can also prevent noncompliant resources from being created.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-features-tools-azure-for-governance-compliance/",
  }
,
  {
    id: 'az900-76',
    question: "Which two tools can you use to create a new Azure virtual machine from a mobile device that runs Android? Each correct answer presents complete solution. Select all answers that apply.",
    options: ["PowerShell in Azure Cloud Shell","Remote Desktop","SSH","the Azure portal"],
    correctAnswer: ['A', 'D'],
    type: 'multiple',
    explanation: "The Azure portal can run on devices that have the Android operating system installed. The browser can be any type, such as Internet Explorer 11, Chrome, Firefox, or Safari (all the latest versions). When you visit the portal, you will see Cloud Shell. Users can then access Bash and PowerShell from within Cloud Shell. You can use Bash and PowerShell to create Azure virtual machines.",
    documentationUrl: "https://learn.microsoft.com/azure/virtual-desktop/users/connect-android-chrome-os",
  }
,
  {
    id: 'az900-77',
    question: "What provides recommendations to reduce the cost of Azure resources? Select only one answer.",
    options: ["Azure Advisor","Azure Dashboard","Azure Service Health","Microsoft Defender for Cloud"],
    correctAnswer: 'A',
    type: 'single',
    explanation: "Azure Advisor analyzes the account usage and makes recommendations based on its set and configured rules.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-monitoring-tools-azure/",
  }
,
  {
    id: 'az900-78',
    question: "You need to create a custom solution that uses thresholds to trigger autoscaling functionality to scale an app up or down to meet user demand. What should you include in the solution? Select only one answer.",
    options: ["Application insights","Azure Advisor","Azure Monitor","Azure Service Health"],
    correctAnswer: 'C',
    type: 'single',
    explanation: "Azure Monitor is a platform that collects metric and logging data, such as CPU percentages. The data can be used to trigger autoscaling.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-monitoring-tools-azure/",
  }
,
  {
    id: 'az900-79',
    question: "What can you use to get notification about an outage in a specific Azure region? Select only one answer.",
    options: ["Azure Advisor","Azure Monitor","Azure Support + Troubleshooting","Azure Service Health"],
    correctAnswer: 'D',
    type: 'single',
    explanation: "Service Health notifies you of Azure-related service issues, such as region-wide downtime.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-monitoring-tools-azure/",
  }
,
  {
    id: 'az900-80',
    question: "Which Azure service can generate an alert if virtual machine utilization is over 80% for five minutes? Select only one answer.",
    options: ["Azure Advisor","Azure Monitor","Azure Policy","Azure Service Health"],
    correctAnswer: 'B',
    type: 'single',
    explanation: "Azure Monitor is a platform for collecting, analyzing, visualizing, and alerting based on metrics. Azure Monitor can log data from an entire Azure and on-premises environment.",
    documentationUrl: "https://learn.microsoft.com/training/modules/describe-monitoring-tools-azure/",
  }
,
  {
    id: 'az900-81',
    question: "Which of the following would be an example of an Internet of Things (IoT) device?",
    options: ["A video game, installed on Windows clients around the world, that keep user scores in the cloud.","A refrigerator that monitors how much milk you have left and sends you a text message when you are running low","A web application that people use to perform their banking tasks","A mobile application that is used to watch online video courses"],
    correctAnswer: 'D',
    type: 'single',
    explanation: "An IoT device is not a standard computing device but connects to a network to report data on a regular basis. A web server, a personal computer, or a mobile app is not an IoT device",
    documentationUrl: "",
  }
,
  {
    id: 'az900-82',
    question: " What advantage does an Application Gateway have over a Load Balancer?",
    options: ["Application gateway understands the HTTP protocol and can interpret the URL and make decisions based on the URL.","Application Gateway is more like an enterprise-grade product. You should not use a load balancer in production.","Application Gateway can be scaled so that two, three or more instances of the gateway can support your application."],
    correctAnswer: 'A',
    type: 'single',
    explanation: "\n Application gateway can make load balancing decisions based on the URL path, while a load balancer\n can’t",
    documentationUrl: "",
  }
,
  {
    id: 'az900-83',
    question: " If you wanted to get an alert every time a new virtual machine is created, where could you create that?",
    options: ["Subscription settings","Azure Dashboard","Azure Monitor","Azure Policy"],
    correctAnswer: 'C',
    type: 'single',
    explanation: " The best place to track events at the resource level is Azure Monitor.",
    documentationUrl: "",
  }
,
  {
    id: 'az900-84',
    question: " What happens if Azure does not meet its own Service Level Agreement guarantee (SLA)?",
    options: ["The service will be free that month","It's not possible. Azure will always meet it's SLA?","You will be financially refunded a small amount of your monthly fee"],
    correctAnswer: 'C',
    type: 'single',
    explanation: " Microsoft offers a refund of 10% or 25% depending on how badly they miss their service guarantee",
    documentationUrl: "",
  }
,
  {
    id: 'az900-85',
    question: " What does it mean that security is a “shared model” in Azure?",
    options: ["Both users and Azure have responsibilities for security.","Azure takes care of security completely.","You must keep your security keys private and ensure it doesn't get out.","Azure takes no responsibility for security"],
    correctAnswer: 'A',
    type: 'single',
    explanation: "The shared security model means that, depending on the application model, you and Azure both have\n roles in ensuring a secure environment.",
    documentationUrl: "",
  }
,
  {
    id: 'az900-86',
    question: " What are groups of subscriptions called?",
    options: ["Azure Policy","Management Groups","ARM Groups","Subscription Groups"],
    correctAnswer: 'B',
    type: 'single',
    explanation: " Subscriptions can be nested and placed into management groups to make managing them easier.",
    documentationUrl: "",
  }
,
  {
    id: 'az900-87',
    question: " What two advantages does cloud computing elasticity give to you? Pick two.",
    options: ["You can serve users better during peak traffic periods by automatically adding more capacity.","You can save money.","Servers have become a commodity and Microsoft doesn't even need to even fix servers that fail within Azure.","You can do more regular backups and you won't lose as much when that backup gets restored"],
    correctAnswer: ['A', 'B'],
    type: 'multiple',
    explanation: "Elasticity saves you money during slow periods (over night, over the weekend, over the summer, etc) and\n also allows you to handle the highest peak of traffic",
    documentationUrl: "",
  }
,
  {
    id: 'az900-88',
    question: " Which database product offers “sub 5 millisecond” response times as a feature?",
    options: ["SQL Server in a VM","Azure SQL Database","Cosmos DB","SQL Data Warehouse"],
    correctAnswer: 'C',
    type: 'single',
    explanation: " Cosmos DB is low latency, and even offers sub 5-ms response times at some levels.\n",
    documentationUrl: "",
  }
,
  {
    id: 'az900-89',
    question: " How many free VMs are included per month on the Azure free account in the first 12 months?\n",
    options: ["2","No such limit","3","1"],
    correctAnswer: 'B',
    type: 'single',
    explanation: " There are some other benefits to a free account, but you get US$200 to spend in the first month.\n",
    documentationUrl: "",
  }
,
  {
    id: 'az900-90',
    question: " What software is used to synchronize your on premises AD with your Azure AD?",
    options: ["Azure AD Federation Services","Azure AD Domain Services","LDAP","AD Connect"],
    correctAnswer: 'D',
    type: 'single',
    explanation: " AD Connect is used to synchronize your corporate AD with Azure AD.",
    documentationUrl: "",
  }
,
  {
    id: 'az900-91',
    question: " What is the goal of a DDoS attack?",
    options: ["To extract data from a database","To crack the password from administrator accounts","To trick users into giving up personal information","To overwhelm and exhaust application resources"],
    correctAnswer: 'D',
    type: 'single',
    explanation: " DDoS is a type of attack that tries to exhaust application resources. The goal is to affect the application’s\n availability and its ability to handle legitimate requests.",
    documentationUrl: "",
  }
,
  {
    id: 'az900-92',
    question: "Which Azure service, when enabled, will automatically block traffic to or from known malicious IP addresses\n and domains?",
    options: ["Azure Active Directory","Network Security Groups","Load Balancer","Azure Firewall"],
    correctAnswer: 'D',
    type: 'single',
    explanation: " Azure Firewall has a threat-intelligence option that will automatically block traffic to/from bad actors on the\n Internet.",
    documentationUrl: "",
  }
,
  {
    id: 'az900-93',
    question: "Which feature within Azure alerts you to service issues that happen in Azure itself, not specifically related to\n your own resources?",
    options: ["Azure Monitor","Azure Security Center","Azure Service Health","Azure Portal Dashboard"],
    correctAnswer: 'D',
    type: 'single',
    explanation: " Azure Service Health – lets you know about any Azure-related service issues including region-wide\n downtime",
    documentationUrl: "",
  }
,
  {
    id: 'az900-94',
    question: " Where can you go to see what standards Microsoft is in compliance with?",
    options: ["Azure Security Center","Azure Service Health","Trust Center","Azure Privacy Page"],
    correctAnswer: 'C',
    type: 'single',
    explanation: "The list of standards that Azure has been certified to meet is in the Trust Center",
    documentationUrl: "",
  }
,
  {
    id: 'az900-95',
    question: "TRUE OR FALSE: If you wanted to deploy a virtual machine to China, you would just choose the China\n region from the drop down.",
    options: ["FALSE","TRUE"],
    correctAnswer: 'A',
    type: 'single',
    explanation: " The statement is A. FALSE.\n Deploying a virtual machine to China requires additional considerations compared to other regions due to\n regulations and data residency requirements. Here’s why:\nSeparate Cloud: Cloud providers like Microsoft Azure and Amazon Web Services (AWS) offer a\n separate cloud environment specifically for China. This isolated environment complies with Chinese\n regulations and data residency laws.\n Limited Functionality: Certain functionalities or services might be unavailable or restricted in the\n China cloud compared to the global offering.\n Therefore, simply choosing the “China region” from a dropdown might not be sufficient for a successful\n deployment. You’ll likely need to use the specific China cloud environment offered by your chosen\n provider and consider potential limitations in functionality.",
    documentationUrl: "https://learn.microsoft.com/en-us/azure/china/overview-operations",
  }
,
  {
    id: 'az900-96',
    question: "Which Azure service can be enabled to enable Multi-Factor Authentication for administrators but not require\n it for regular users?",
    options: ["Azure AD B2B","Privileged Identity Management","Advanced Threat Protection","Azure Firewall"],
    correctAnswer: 'B',
    type: 'single',
    explanation: "Privileged Identity Management can be used to ensure privileged users have to jump through additional\n verification because of their role",
    documentationUrl: "",
  }
,
  {
    id: 'az900-97',
    question: " Which of the following elements is considered part of the “network” layer of network security?",
    options: ["Keep operating systems up to date with patches","Use a firewall","Separate servers into distinct subnets by role","Locks on the data center doors"],
    correctAnswer: 'C',
    type: 'single',
    explanation: " Subnets is part of network security.",
    documentationUrl: "",
  }
,
  {
    id: 'az900-98',
    question: " A company is planning on purchasing Azure AD Basic for their Azure account. Does the Azure AD Basic tier\n come with an SLA of 99.9%?",
    options: ["A. Yes","B. NO"],
    correctAnswer: 'A',
    type: 'single',
    explanation: "Yes, this is also mentioned in the Microsoft documentation\n For more information on Azure AD SLA, please visit the below URL\n",
    documentationUrl: " https://azure.microsoft.com/en-us/support/legal/sla/active-directory/v1_0",
  }
,
  {
    id: 'az900-99',
    question: " A company needs to store 2TB of data that will be infrequently used. The data needs to be accessed via\n PowerBI. Which of the following would you consider as a cost-effective data storage layer for this\n requirement? Choose 2 answers from the options given below",
    options: ["A. Azure SQL Databases","B. Azure SQL Datawarehouse","C. Azure PostgreSQL","D. Azure CosmosDB","E. Azure Data Lake"],
    correctAnswer: ['B', 'E'],
    type: 'multiple',
    explanation: " If you need to store large amounts of data that is not accessed frequently then look at having a data\n warehouse or using a data lake.\n Using a transactional database such as SQL, PostgreSQL and CosmosDB is good for data that is accessed\n frequently.\n You can also visualize your data in SQL Data warehouse and Azure Data Lake using PowerBI\n For more information on Azure SQL Data warehouse, Azure Data lake and the integrations, please visit\n the below URL\n",
    documentationUrl: " https://azure.microsoft.com/en-us/solutions/data-lake/  https://azure.microsoft.com/en-us/services/sql-data-warehouse/  https://powerbi.microsoft.com/en-us/integrations/azure-sql-data-warehouse/  https://docs.microsoft.com/en-us/azure/data-lake-store/data-lake-store-power-bi",
  }
,
  {
    id: 'az900-100',
    question: " A company is planning on creating several Virtual Machines in Azure. They would be using the Azure Virtual\n Machine service. Which of the following is the right category to which the Azure Virtual Machine service\n belongs to?",
    options: ["A. Infrastructure as a service (IaaS)","B. Platform as a service (PaaS)","C. Software as a service (SaaS)","D. Function as a service (FaaS)"],
    correctAnswer: 'A',
    type: 'single',
    explanation: " The Microsoft documentation gives an example of the difference between IaaS, PaaS and SaaS as shown\n below\n IaaS constitutes the Infrastructure which constitutes your Azure Virtual Machines.\n Since this is clearly shown, all other options are incorrect\n For more information on what is IaaS, please visit the below URL\n",
    documentationUrl: "https://azure.microsoft.com/en-us/resources/cloud-computing-dictionary/what-is-iaas/",
  }
,
  {
    id: 'az900-101',
    question: "A company wants to make use of Azure for deployment of various solutions. They want to ensure that\n whenever users authenticate to Azure, they have to make use of Multi-Factor Authentication. Which of the\n following can help them achieve this?",
    options: ["A. Azure AD Identity Protection","B. Azure Security Centre","C. Azure DDoS protection","D. Azure privileged identity management"],
    correctAnswer: 'A',
    type: 'single',
    explanation: " With Azure AD Identity Protection, you can make use of policies that can enforce MFA for users. The\n Microsoft documentation mentions the following\n Option B is incorrect since this is a unified infrastructure security management system in Azure\n Option C is incorrect since this is a solely a solution to protect against DDoS attacks\n Option D is incorrect since this service is mostly used to give just-in-time access to resources\n For more information on how to use MFA policies in identity protection, please visit the below URL\n",
    documentationUrl: " https://docs.microsoft.com/en-us/azure/active-directory/identity-protection/howto-mfa-policy",
  }
,
  {
    id: 'az900-102',
    question: "A company is planning on hosting 2 Virtual Machines in Azure as shown below\n Virtual Machine Name Virtual Machine Size\n demovm B1S\n demovm1 B1S\n When the virtual machine demovm is stopped, you will still incur costs for the storage attached to the\n Virtual Machine?",
    options: ["A. Yes","B. No"],
    correctAnswer: 'A',
    type: 'single',
    explanation: "The Disks attached to a Virtual Machine have different costs associated with them.\n Below is a screenshot from the pricing calculator for a Virtual Machine. You can see that there is a\n dependency on the OS Disk.\n For more information on the pricing calculator, please visit the below URL\n",
    documentationUrl: " https://azure.microsoft.com/en-us/pricing/calculator/",
  }
,
  {
    id: 'az900-103',
    question: " A company is planning on setting up a solution in Azure. The solution would have the following key\n requirement\n An Integration solution for the deployment of code\n Which of the following would be best suited for this requirement?",
    options: ["A. Azure Advisor","B. Azure Cognitive Services","C. Azure Application Insights","D. Azure Devops"],
    correctAnswer: 'D',
    type: 'single',
    explanation: " Azure Devops consists of a large set of tools. Amongst these you have Azure Pipelines which can be used\n to build, test and deploy code.\n Since this is a clear feature on the tool, all other options are incorrect\n For more information on Azure Devops, please visit the below URL\n\n",
    documentationUrl: " https://azure.microsoft.com/en-us/services/devops/",
  }
,
  {
    id: 'az900-104',
    question: " An IT Engineer needs to create a Virtual Machine in Azure. Currently the IT Engineer has a Windows\n desktop and has installed the Azure Command Line interface. From which of the following could the IT\n engineer use the Azure Command Line Interface. Choose 2 answers from the options given below",
    options: ["A. Powershell","B. File and Print Explorer","C. Command Prompt","D. Google Chrome"],
    correctAnswer: ['A', 'C'],
    type: 'multiple',
    explanation: "You can launch the Azure command line tool from command prompt as shown below\n Or you could also launch it from powershell as shown below\n Options B and D are incorrect because you can’t launch Azure Command Line from any of these options.\n For more information on Azure Command Line Interface, please visit the below URL\n https://docs.microsoft.com/en-us/cli/azure/get-started-with-azure-cli?view=azure-cli-latest\n\n",
    documentationUrl: " https://docs.microsoft.com/en-us/cli/azure/get-started-with-azure-cli?view=azure-cli-latest",
  }
,
  {
    id: 'az900-105',
    question: "A company wants to try out some services which are being offered by Azure in Public Preview. Should the\n company deploy resources which are part of Public Preview in their production environment?",
    options: ["A. Yes","B. No"],
    correctAnswer: 'B',
    type: 'single',
    explanation: "As mentioned below in the Microsoft documentation, there is no SLA or guarantee for any service in\n Public Preview. So, you should not look at deploying such services in production\n For more information on Azure services preview terms, please visit the below URL\n",
    documentationUrl: " https://azure.microsoft.com/en-us/support/legal/preview-supplemental-terms/",
  }
,
  {
    id: 'az900-106',
    question: "A company is planning on using Azure Storage Accounts. They have the following requirement\n Storage of 2 TB of data\n Storage of a million files\n Would using Azure Storage fulfil these requirements?",
    options: ["A. Yes","B. No"],
    correctAnswer: 'A',
    type: 'single',
    explanation: " If you look at the Microsoft documentation, Azure storage has a high limit on the amount that can be\n stored and no limit on the number of files\n For more information on Azure storage capabilities, please visit the below URL\n",
    documentationUrl: " https://docs.microsoft.com/en-us/azure/storage/common/storage-scalability-targets",
  }
,
  {
    id: 'az900-107',
    question: " A company wants to make use of Azure for deployment of various solutions. They want to ensure that\n suspicious attacks and threats to resources in their Azure account are prevented. Which of the following\n helps prevent such attacks by using in-built sensors in Azure?",
    options: ["A. Azure AD Identity Protection","B. Azure DDoS attacks","C. Azure privileged identity management","D. Azure Advanced Threat protection"],
    correctAnswer: 'D',
    type: 'single',
    explanation: "The Microsoft documentation states the below feature on the Azure Advanced Thread protection service\n Options A and C are incorrect since these are used for protecting identities in Azure AD\n Option B is incorrect since this is a solely a solution to protect against DDoS attacks\n For more information on Azure Advanced Thread protection, please visit the below URL\n\n",
    documentationUrl: " https://docs.microsoft.com/en-us/azure-advanced-threat-protection/what-is-atp",
  }
,
  {
    id: 'az900-108',
    question: "A company has just deployed a Virtual Machine named demovm to Azure. The overview of the Virtual\n Machine is shown below.\n The company needs to know if the underlying infrastructure in Azure hosting the Virtual Machine has any\n issues? Where could they view such issues?",
    options: ["A. Azure Advisor","B. Azure AD","C. The Virtual Machine blade","D. Azure Monitor"],
    correctAnswer: 'C',
    type: 'single',
    explanation: "You can see for any service health issues for the infrastructure of the Virtual Machine in the VM blade\n itself. Just go to Resource health as shown below\n Option A is incorrect since this is used to provide recommendations in Azure\n Option B is incorrect since this is used for identity management\n Option D is incorrect since will give you the health of the entire Azure Infrastructure but will not\n specifically let you know on the infrastructure health for just the Virtual Machine.\n For more information on Azure resource health, please vsit the below URL\n",
    documentationUrl: " https://docs.microsoft.com/en-us/azure/service-health/resource-health-overview",
  }
,
  {
    id: 'az900-109',
    question: " A company wants to make use of an Azure service in private preview. Are Azure services in private preview\n available to all customers?",
    options: ["A. Yes","B. No"],
    correctAnswer: 'B',
    type: 'single',
    explanation: "Services in private preview are only available upon request. An example is given below. If you go to the\n services available in beta phase and click on “Try it”\n You will be directed to complete a form to avail the preview of the service.\n For more information on services in beta test phase, please visit the below URL\n\n",
    documentationUrl: " https://azure.microsoft.com/en-us/services/preview/",
  }
,
  {
    id: 'az900-110',
    question: "An IT Engineer needs to create a Virtual Machine in Azure. Currently the IT Engineer has an Android OS\n based workstation. Which of the following can the IT Engineer use to create the desired Virtual Machine in\n Azure?",
    options: ["A. Microsoft PowerApps","B. Azure Cloud Shell","C. Azure Powershell","D. Azure CLI"],
    correctAnswer: 'B',
    type: 'single',
    explanation: "On an Android OS, one can go to the Portal and launch Azure CLI as shown below\n Option A is incorrect since PowerApps would not be used to create Virtual Machines\n Options C and D are incorrect since currently there is no clear stated definition on the support for Azure\n CLI or powershell support on Android OS.\n For more information on Azure Cloud Shell, please visit the below URL\n",
    documentationUrl: " https://azure.microsoft.com/en-us/features/cloud-shell/",
  }
,
  {
    id: 'az900-111',
    question: "Whom amongst the following can use the services offered as part of “Azure Germany”?",
    options: ["A. Only Enterprises in Germany","B. Only users located in Germany","C. Only Enterprises and users located in Germany","D. All customers who intend to do business in the EU"],
    correctAnswer: 'D',
    type: 'single',
    explanation: " This is mentioned in the Microsoft documentation\n Since this is clearly mentioned, all other options are incorrect\n For more information on Azure Germany, please visit the below URL\n",
    documentationUrl: " https://docs.microsoft.com/en-us/azure/germany/germany-welcome",
  }
,
  {
    id: 'az900-112',
    question: "A company is planning on setting up an Azure Free Account. Does the Basic Support plan come along with\n the Azure Free Account?",
    options: ["A. Yes","B. No"],
    correctAnswer: 'A',
    type: 'single',
    explanation: "This is mentioned in the Microsoft documentation\n For more information on the comparison of Support plans, please visit the below URL\n",
    documentationUrl: " https://azure.microsoft.com/en-us/support/plans/",
  }
,
  {
    id: 'az900-113',
    question: " A company is planning on using their Azure Free Account for hosting production-based resources. Does the\n Azure Free Account allow you to host production-based resources?",
    options: ["A. Yes","B. No"],
    correctAnswer: 'A',
    type: 'single',
    explanation: "Yes, you can, although you need to understand that you will need to pay for any extra charges that don’t\n come under the Free Account conditions.\n This is also mentioned in the Microsoft documentation\n For more information on the Azure Free Account, please visit the below URL\n",
    documentationUrl: " https://azure.microsoft.com/en-us/free/free-account-faq/",
  }
,
  {
    id: 'az900-114',
    question: " Your company is planning on using Azure AD for authentication to the resources defined in Azure. Does\n Azure AD have in-built capabilities for securing authentication and authorization to resources?",
    options: ["A. Yes","B. No"],
    correctAnswer: 'A',
    type: 'single',
    explanation: "For authentication, there are multiple ways to secure the sign in process. As shown in the Microsoft\n documentation below, you can use additional security options such as Security questions, Multi-Factor\n authentication etc.\n For authorization, you can use the various roles available in Azure. Below is the concept behind Role\n based access control in Azure\n For more information on Role based access control and authentication, please visit the below URL",
    documentationUrl: " https://docs.microsoft.com/en-us/azure/role-based-access-control/  https://docs.microsoft.com/en-us/azure/active-directory/authentication/concept-authentication-methods",
  }
,
  {
    id: 'az900-115',
    question: "A company is planning on upgrading their current Azure Free plan to the Basic plan. Does the Free and\n Basic Azure AD plan come with the same standard support from Microsoft?",
    options: ["A. Yes","B. No"],
    correctAnswer: 'B',
    type: 'single',
    explanation: " The support plans are purchased and managed separately. This is also given in the Microsoft\n documentation\n For more information on Azure AD pricing, please visit the below URL\n",
    documentationUrl: " https://azure.microsoft.com/en-us/pricing/details/active-directory/",
  }
,
  {
    id: 'az900-116',
    question: "A company wants to try out some services which are being offered by Azure in Public Preview. Do the\n services in Public Preview in Azure come with an SLA?",
    options: ["A. Yes","B. No"],
    correctAnswer: 'B',
    type: 'single',
    explanation: "This is mentioned in the Microsoft documentation\n For more information on Azure services preview terms, please visit the below URL\n",
    documentationUrl: " https://azure.microsoft.com/en-us/support/legal/preview-supplemental-terms/",
  }
,
  {
    id: 'az900-117',
    question: " A company wants to try out some services which are being offered by Azure in Public Preview. Does\n Microsoft provide a separate Azure portal for trying out the services in Public Preview?",
    options: ["A. Yes","B. No"],
    correctAnswer: 'B',
    type: 'single',
    explanation: "Preview portal: https://preview.portal.azure.com\n Normal Portal: https://portal.azure.com\n Services which are in Public Preview are available to users in the normal Azure portal itself. An example of\n Private Preview shows in the following screenshot below.\n For more information on Azure services in preview, please visit the below URL",
    documentationUrl: " https://azure.microsoft.com/en-us/services/preview/  https://azure.microsoft.com/en-us/support/legal/preview-supplemental-terms/  https://preview.portal.azure.com",
  }
,
  {
    id: 'az900-118',
    question: " Your company needs to deploy and manage several Azure Web apps using the Azure App service resource.\n Which of the following URL would you use to manage the Azure Web Apps?",
    options: ["A. https://portal.microsoft.com","B. https://portal.azure.com","C. https://portal.azurewebsites.net","D. https://portal.azurewebsites.com"],
    correctAnswer: 'B',
    type: 'single',
    explanation: "If you need to create and manage Azure Web apps, then you can do that from the Azure portal as shown\n below\n The URL for the Azure portal is https://portal.azure.com\n For more information on the Azure portal, please visit the below URL\n",
    documentationUrl: " https://azure.microsoft.com/en-us/features/azure-portal/",
  }
,
  {
    id: 'az900-119',
    question: "A company wants to ensure that users in their company are authenticated when they access resources\n defined in their Azure account. Which of the following is the correct definition of authentication?",
    options: ["A. This specifies the type of service you can use in Azure","B. This specifies the type of data you can use in Azure","C. This is the act of providing legitimate credentials","D. This specifies what you can do in Azure"],
    correctAnswer: 'C',
    type: 'single',
    explanation: "The definition of Authentication and Authorization is given in the Microsoft documentation\n The other options are all incorrect because these are all user cases of Authorization\n For more information on authentication, please visit the below URL\n",
    documentationUrl: " https://docs.microsoft.com/en-us/azure/active-directory/develop/authentication-scenarios",
  }
,
  {
    id: 'az900-120',
    question: "A company is planning on setting up an Enterprise Azure Subscription. Do they need to have a valid\n Microsoft account for associating the Azure Subscription?",
    options: ["A. Yes","B. No"],
    correctAnswer: 'A',
    type: 'single',
    explanation: "For setting this up, you need to have a valid:\n Work Account\n School Account\n Microsoft account.\n Below is a snapshot from the Microsoft documentation to validate this\n For more information on setting up an Enterprise Azure subscription, please visit the below URL",
    documentationUrl: " https://docs.azure.cn/en-us/articles/azure-global-purchasing-guidance/go-global-playbook-purchase process-of-enterprise-azure",
  }
,
  {
    id: 'az900-121',
    question: "An IT administrator for a company has been given a powershell script. This powershell script will be used to\n create several Virtual Machines in Azure. You have to provide a machine to the IT administrator for running\n the powershell script.\n You decide to provide a Linux machine which has the Azure CLI tools installed.\n Would this solution fit the requirement?",
    options: ["A. Yes","B. No"],
    correctAnswer: 'B',
    type: 'single',
    explanation: "The Azure CLI is used to run CLI based commands and not powershell commands.\n For more information on Azure CLI, please visit the below URL\n",
    documentationUrl: " https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest",
  }
,
  {
    id: 'az900-122',
    question: " An IT administrator for a company has been given a powershell script. This powershell script will be used to\n create several Virtual Machines in Azure. You have to provide a machine to the IT administrator for running\n the powershell script.\n You decide to provide a ChromeOS based machine and use Azure Cloud Shell\n Would this solution fit the requirement?",
    options: ["A. Yes","B. No"],
    correctAnswer: 'A',
    type: 'single',
    explanation: "From the Azure Portal, if you use Azure Cloud Shell, you can run both Bash and powershell based scripts\n For more information on Azure CloudShell, please visit the below URL",
    documentationUrl: " https://azure.microsoft.com/en-us/features/cloud-shell/  https://docs.microsoft.com/en-us/azure/cloud-shell/overview  https://docs.microsoft.com/en-us/azure/cloud-shell/persisting-shell-storage",
  }
,
  {
    id: 'az900-123',
    question: "An IT administrator for a company has been given a powershell script. This powershell script will be used to\n create several Virtual Machines in Azure. You have to provide a machine to the IT administrator for running\n the powershell script.\n You decide to provide a computer that has MacOS and Powershell Core 6.0 installed.\n Would this solution fit the requirement?",
    options: ["A. Yes","B. No"],
    correctAnswer: 'A',
    type: 'single',
    explanation: "Yes, you can install Powershell on MacOS and then run the powershell scripts\n For more information on installing powershell on MacOS, please visit the below URL\n",
    documentationUrl: " https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell-core-on-macos? view=powershell-6",
  }
,
  {
    id: 'az900-124',
    question: " A company is planning on setting up a solution in Azure. The solution would have the following key\n requirement\n A tool that provides guidance and recommendations to improve an Azure environment\n Which of the following would be best suited for this requirement?\n",
    options: ["A. Azure Advisor","B. Azure Cognitive Services","C. Azure Application Insights","D. Azure Devops"],
    correctAnswer: 'A',
    type: 'single',
    explanation: " This is clearly mentioned in the Microsoft documentation\n Since this is a clear feature on the tool, all other options are incorrect\n For more information on Azure Advisor, please visit the below URL\n",
    documentationUrl: " https://docs.microsoft.com/en-us/azure/advisor/advisor-overview",
  }
,
  {
    id: 'az900-125',
    question: " A company is planning on setting up a solution in Azure. The solution would have the following key\n requirement\n A simplified tool to build intelligent Artificial Intelligence applications\n Which of the following would be best suited for this requirement?",
    options: ["A. Azure Advisor","B. Azure Cognitive Services","C. Azure Application Insights","D. Azure Devops"],
    correctAnswer: 'B',
    type: 'single',
    explanation: "As shown in the Microsoft documentation below, the Azure Cognitive services has an entire list of\n features that can be used to build Artificial Intelligent based applications.\n Since this is a clear feature on the tool, all other options are incorrect\n For more information on Azure Cognitive services, please visit the below URL",
    documentationUrl: " https://azure.microsoft.com/en-us/services/cognitive-services/",
  }
,
  {
    id: 'az900-126',
    question: "A company is planning on setting up a solution in Azure. The solution would have the following key\n requirement\n A tool used to monitor Web applications hosted in production based environments\n Which of the following would be best suited for this requirement?",
    options: ["A. Azure Advisor","B. Azure Cognitive Services","C. Azure Application Insights","D. Azure Devops"],
    correctAnswer: 'C',
    type: 'single',
    explanation: " This is clearly mentioned in the Microsoft documentation\n Since this is a clear feature on the tool, all other options are incorrect\n For more information on Azure Application Insights, please visit the below URL\n",
    documentationUrl: " https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview",
  }
,
  {
    id: 'az900-127',
    question: "A company is planning on deploying Azure resources to a resource group. But the resources would belong\n to different locations. Can you have resources that belong to the same resource group but be in multiple\n locations?",
    options: ["A. Yes","B. No"],
    correctAnswer: 'A',
    type: 'single',
    explanation: "An example is shown below in Azure, where you can have resources in same resource groups, but\n different locations.\n For more information on Azure Resource Manager, please visit the below URL\n",
    documentationUrl: " https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-overview",
  }
,
  {
    id: 'az900-128',
    question: "A company is planning on deploying Azure resources to a resource group. The company is planning on\n assigning tags to the resource groups. Would the resources in the resource group also inherit the same\n tags?",
    options: ["A. Yes","B. No"],
    correctAnswer: 'B',
    type: 'single',
    explanation: "An example is shown below where a resource group has a tag defined.\n And there is a resource defined in the resource group\n If you go to the Tags section of the resource, you will see that there are no tags defined\n For more information on Azure Resource Group Tags, please visit the below URL\n",
    documentationUrl: " https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-using-tags",
  }
,
  {
    id: 'az900-129',
    question: "A company is planning on deploying Azure resources to a resource group. The company is planning on\n assigning permissions to the resource groups. Would the resources in the resource group also inherit the\n same permissions?",
    options: ["A. Yes","B. No"],
    correctAnswer: 'A',
    type: 'single',
    explanation: " An example is shown below where a resource group has a permission defined.\n And there is a resource defined in the resource group\n If you go to the Access Control section of the resource, you will see that the permissions is inherited from\n the resource group.\n For more information on role-based access control, please visit the below URL\n",
    documentationUrl: " https://docs.microsoft.com/en-us/azure/role-based-access-control/role-assignments-portal",
  }
,
  {
    id: 'az900-130',
    question: "A company has a set of resources deployed to Azure. They want to make use of the Azure Advisor tool.\n Would the Azure Advisor tool give recommendations on how to improve the security of the Azure AD\n environment?",
    options: ["A. Yes","B. No"],
    correctAnswer: 'A',
    type: 'single',
    explanation: "The below screenshot from Azure documentation shows what Azure Advisor does.\n Azure Security can give you recommendations on how to secure your resources in Azure. Azure AD is already a secure platform. You should instead focus on how to secure sign-ins that occur using Azure AD.\n For more information on Azure AD security recommendations, please visit the below URL\n",
    documentationUrl: " https://docs.microsoft.com/en-us/azure/advisor/advisor-security-recommendations",
  }
,
  {
    id: 'az900-131',
    question: "A company has a requirement to deploy 10 different types of Azure resources for several departments. All\n of the resources types and configurations are the same. Which of the following could be used to automate\n the deployment of the resources?",
    options: ["A. Azure Resource Manager templates","B. Virtual machine scale sets","C. Azure API Management service","D. Management groups"],
    correctAnswer: 'A',
    type: 'single',
    explanation: " The Microsoft documentation gives the definition of a template as shown below\n Resource Manager templates are the ideal solution when you have to deploy the same type of resource\n repeatedly\n Option B is incorrect since this is good only if you need to automate the deployment of Virtual Machines\n Option C is incorrect since this is used for making API calls to Azure\n Option D is incorrect since this is used to group your resources within subscriptions\n For more information on Resource Manager, please visit the below URL\n",
    documentationUrl: " https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-overview",
  }
,
  {
    id: 'az900-132',
    question: " A company is planning on hosting solutions on the Azure Cloud. They need to implement MFA for identities\n hosted in Azure. Is it necessary to deploy a federation solution or sync on-premise identities to the cloud?",
    options: ["A. Yes","B. No"],
    correctAnswer: 'B',
    type: 'single',
    explanation: "There are various ways to implement MFA on Azure, like using Conditional Access policies. In Azure AD,\n you can also manage MFA settings as shown below\n For more information on how to configure MFA settings, please visit the below URL\n",
    documentationUrl: " https://docs.microsoft.com/en-us/azure/active-directory/authentication/howto-mfa-mfasettings",
  }
,
  {
    id: 'az900-133',
    question: " A company has deployed their solutions on to Azure. They have users that connect to Azure AD via the\n Internet. They have the requirement that if users try to login from an anonymous IP address, they are then\n prompted to change their password. Which of the following should the company consider for this\n requirement?\n",
    options: ["A. Azure AD Connect Health","B. Azure AD Privileged Identity Management","C. Azure Advanced Threat Protection (ATP)","D. Azure AD Identity Protection"],
    correctAnswer: 'D',
    type: 'single',
    explanation: "You have to create a policy in Azure AD Identity Protection. An example is shown below\n First go to User risk policy\n Next go to Controls\n Then based on the user sign in risk condition, you can make the user change the password as per the\n policy\n Option A is incorrect since this is used to check the health status of Azure AD Connect\n Option B is incorrect since is used for privileged level access in Azure\n Option C is incorrect since this is used to protect resources in Azure\n For more information on Azure AD Identity protection, please visit the below URL\n",
    documentationUrl: " https://docs.microsoft.com/en-us/azure/active-directory/identity-protection/overview",
  }
,
  {
    id: 'az900-134',
    question: " A company plans to setup multiple resources in their Azure subscription. They want to implement tagging\n of resources in Azure. But they want to ensure that when resource groups are created, they have to contain\n a tag with a name of “organization” and value of “skillcertlabs”.\n You recommend using Azure locks for implementing this requirement\n Would this recommendation fulfil the requirement?",
    options: ["A. Yes","B. No"],
    correctAnswer: 'B',
    type: 'single',
    explanation: " Azure locks are used to prevent accidental modification or deletion of resources in Azure.\n For more information on Azure locks, please visit the below URL\n",
    documentationUrl: " https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-lock-resources",
  }
,
  {
    id: 'az900-135',
    question: "A company plans to setup multiple resources in their Azure subscription. They want to implement tagging\n of resources in Azure. But they want to ensure that when resource groups are created, they have to contain\n a tag with a name of “organization” and value of “skillcertlabs”.\n You recommend using Azure policies for implementing this requirement\n Would this recommendation fulfil the requirement?",
    options: ["A. Yes","B. No"],
    correctAnswer: 'A',
    type: 'single',
    explanation: "Yes, you can use Azure policies. For this, there is also an inbuilt policy that can be used as shown below\n to implement tagging for resources groups\n For more information on Azure policies, please visit the below URL\n",
    documentationUrl: " https://docs.microsoft.com/en-us/azure/governance/policy/overview",
  }
];
export const seedQuestionsAZ900: Question[] = rawQuestions.map(convertQuestion);
