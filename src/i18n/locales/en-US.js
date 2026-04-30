export default {
  common: {
    loading: 'Loading...',
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    reset: 'Reset',
    success: 'Success',
    failed: 'Failed',
    noData: 'No Data',
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    guest: 'Guest Mode',
    profile: 'Profile',
    monitor: 'Monitoring System',
    chinese: '中文',
    english: 'English',
    languageSwitch: 'Language Switch',
    online: 'Online',
    offline: 'Offline',
    viewStatus: 'View Status',
    bindSuccess: 'Bind Success',
    bindSuccessMsg: 'Bind successful! Agent added to list',
    pageInitFailed: 'Page initialization failed, please refresh',
    setToken: 'Set Token',
    setTokenDev: 'Set Token feature under development',
    accountSwitchOk: 'Account switched successfully',
    monitorNav: 'Monitor',
    confirmDelete: 'Confirm',
    unknown: 'Unknown'
  },
  auth: {
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    phone: 'Phone',
    verificationCode: 'Verification Code',
    sendCode: 'Send Code',
    codeSent: 'Code Sent',
    loginSuccess: 'Login Success',
    registerSuccess: 'Register Success',
    loginRequired: 'Please login to use this feature',
    passwordStrength: 'Password must be at least 8 characters with letters and numbers',
    emailRegistered: 'Email already registered, please login',
    codeExpired: 'Code expired, please get a new one',
    resetPassword: 'Reset Password',
    enterEmail: 'Please enter email',
    newPassword: 'New Password',
    enterNewPassword: 'Please enter new password',
    reEnterPassword: 'Please re-enter password',
    backToLogin: 'Back to Login',
    passwordRequired: 'Please enter password',
    passwordMinLength: 'Password must be at least 8 characters',
    passwordMustContain: 'Password must contain both letters and numbers',
    passwordMismatch: 'Passwords do not match',
    emailRequired: 'Please enter email',
    emailInvalid: 'Please enter a valid email address',
    resetSuccess: 'Password reset successfully',
    resetFailed: 'Password reset failed',
    welcomeBack: 'Welcome back to OpenClaw Monitoring System',
    noAccount: "Don't have an account?",
    forgotPassword: 'Forgot password?',
    loginFailed: 'Login failed',
    loginFailedNetwork: 'Login failed, please check your network connection',
    createAccount: 'Create your OpenClaw Monitoring System account',
    hasAccount: 'Already have an account?',
    phoneInvalid: 'Please enter a valid phone number',
    codeRequired: 'Please enter verification code',
    codeSixDigits: 'Verification code must be 6 digits',
    enterEmailFirst: 'Please enter email first',
    codeSentToEmail: 'Verification code has been sent to your email, please check',
    codeSendFailed: 'Failed to send verification code',
    registerFailed: 'Registration failed'
  },
  gateway: {
    bind: 'Bind Gateway',
    unbind: 'Unbind Gateway',
    testConnection: 'Test Connection',
    connectionSuccess: 'Connection Success',
    connectionFailed: 'Connection Failed',
    gatewayUrl: 'Gateway URL',
    token: 'Token',
    agentName: 'Agent Name',
    bindSuccess: 'Bind Success',
    bindFailed: 'Bind Failed',
    maxAgents: 'Maximum limit reached (8 agents)',
    discovering: 'Discovering agents...',
    discovered: 'Agents discovered',
    step1: 'Fill Configuration',
    step2: 'Test Connection',
    step3: 'Complete Binding',
    inputAgentName: 'Enter agent name',
    inputGatewayUrl: 'https://gateway.example.com',
    inputToken: 'Enter token',
    nextStep: 'Next',
    prevStep: 'Previous',
    complete: 'Complete',
    connectionStatus: 'Connection Status',
    connectionLatency: 'Connection Latency',
    connectionMessage: 'Message',
    ms: 'ms',
    agentNameRequired: 'Please enter agent name',
    gatewayUrlRequired: 'Please enter Gateway URL',
    urlInvalid: 'Please enter a valid URL',
    tokenRequired: 'Please enter token',
    testBeforeBind: 'Please test the connection successfully before binding',
    testFailed: 'Connection test failed',
    paramError: 'Parameter error: ',
    checkGatewayToken: 'Please check the Gateway URL and Token',
    authFailed: 'Authentication failed: Invalid Token',
    gatewayNotFound: 'Gateway URL not found or unreachable',
    serverError: 'Server error: ',
    networkError: 'Network error: Unable to connect to Gateway',
    configError: 'Request configuration error: '
  },
  monitor: {
    status: 'Status',
    running: 'Running',
    offline: 'Offline',
    busy: 'Busy',
    idle: 'Idle',
    working: 'Working',
    sessions: 'Sessions',
    tokenUsage: 'Token Usage',
    onlineTime: 'Online Time',
    memory: 'Memory',
    messages: 'Messages',
    tasks: 'Tasks',
    channels: 'Channels',
    kbi: 'KBI Metrics',
    boundAgents: 'Bound Agents',
    gatewayAddress: 'Gateway URL:',
    type: 'Type:',
    mainAgent: 'Main Agent',
    boundAt: 'Bound At:',
    deleteConfirm: 'Are you sure you want to delete Gateway "{name}"? This will remove the Gateway and all its agent data. This action cannot be undone.',
    deleteTitle: 'Delete Confirmation',
    deleteSuccess: 'Deleted successfully',
    deleteFailed: 'Delete failed',
    noAgentMsg: 'No agents under this Gateway. Please click "Add Agent" or "Refresh Status"',
    selectedAgent: 'Selected agent: {name}',
    taskList: 'Task List',
    unknownTask: 'Unknown Task',
    completed: 'Completed',
    failed: 'Failed',
    pending: 'Pending',
    inProgress: 'In Progress',
    noTasks: 'No Tasks',
    startTime: 'Start:',
    endTime: 'End:',
    runStatus: 'Run Status',
    memoryUsage: 'Memory Usage',
    messageStats: 'Message Stats',
    llmModel: 'LLM Model',
    session: 'Session',
    progressLabel: 'Progress: ',
    messageLabel: 'Message',
    channelStatus: 'Channel Status',
    messageColon: 'Messages:',
    activeColon: 'Active:',
    noChannelData: 'No channel data',
    connected: 'Connected',
    disconnected: 'Disconnected',
    abnormal: 'Error',
    notConfigured: 'Not Configured',
    mainSession: 'Main Session',
    messageCount: 'Messages',
    addAgent: 'Add Agent',
    addNewAgent: 'Add New Agent',
    agentNameLabel: 'Agent Name',
    close: 'Close',
    unbindConfirm: 'Are you sure you want to unbind "{name}"?',
    unbindTitle: 'Confirm Unbind',
    unbindSuccess: 'Unbind successful',
    deleteAgentConfirm: 'Are you sure you want to delete this Agent? This cannot be undone.',
    testConnectionDev: 'Test connection feature under development',
    editDev: 'Edit feature under development',
    addSuccess: 'Added successfully',
    notConnected: 'Not Connected',
    operation: 'Actions',
    boundTime: 'Bound At',
    demoTask1: 'Memory Archive',
    demoTask2: 'Team Report',
    demoTask3: 'Team Learning'
  },
  agent: {
    main: 'Main Agent',
    sub: 'Sub Agent',
    addTab: '+ Add',
    maxTabs: 'Maximum 8 agent tabs supported',
    switchTab: 'Switch Agent',
    multiManage: 'Multi-Agent Management'
  },
  storage: {
    settings: 'Storage Settings',
    retention: 'Data Retention',
    days7: '7 Days',
    days30: '30 Days',
    days90: '90 Days',
    forever: 'Forever',
    currentUsage: 'Current Usage',
    clearAll: 'Clear All Data',
    clearConfirm: 'Are you sure? This cannot be undone!',
    exportData: 'Export Data',
    exportSuccess: 'Export Success',
    exportFailed: 'Export Failed',
    dataOperation: 'Data Operations',
    exportSuccessMsg: 'Data exported successfully',
    exportFailedMsg: 'Data export failed',
    clearConfirmMsg: 'Are you sure you want to clear all local data? This cannot be undone!',
    clearTitle: 'Confirm Clear',
    clearSuccessMsg: 'Data cleared',
    clearFailedMsg: 'Clear failed',
    saveSuccessMsg: 'Settings saved'
  },
  legal: {
    disclaimer: 'Disclaimer',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    contact: 'Contact',
    copyright: '© 2026 OpenClaw. All rights reserved.',
    contactTitle: 'Contact Us',
    contactContent: 'If you have any questions or suggestions, please contact us at:',
    contactEmail: 'Email: 5003698@qq.com',
    termsDetail: {
      title: 'Terms of Service',
      updateTime: 'Last Updated: March 25, 2026',
      sections: [
        {
          heading: '1. Acceptance of Terms',
          paragraphs: ['Welcome to OpenClaw Monitoring System (hereinafter referred to as "the Service"). By accessing or using the Service, you confirm that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with these terms, please do not use the Service.']
        },
        {
          heading: '2. Service Description',
          paragraphs: ['OpenClaw Monitoring System is an open-source agent status monitoring platform that provides the following features:'],
          items: ['Real-time agent status monitoring', 'Gateway device binding and management', 'Channel status tracking', 'Task list management', 'Data storage and export']
        },
        {
          heading: '3. User Registration',
          paragraphs: ['Using certain features of the Service may require you to register an account. When registering, you agree to:'],
          items: ['Provide truthful, accurate, and complete personal information', 'Update your personal information in a timely manner', 'Maintain the security of your account and be responsible for others using your account', 'Comply with all applicable laws and regulations']
        },
        {
          heading: '4. User Conduct',
          paragraphs: ['When using the Service, you agree not to:'],
          items: ['Violate any applicable laws, regulations, or rules', 'Infringe upon the intellectual property or other legal rights of others', 'Post or transmit any illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable content', 'Interfere with or disrupt the Service or servers or networks connected to the Service', 'Access any part of the Service or other accounts without authorization', 'Use the Service for any commercial purpose unless expressly authorized']
        },
        {
          heading: '5. Intellectual Property',
          paragraphs: ['The Service and all its content, features, and functionality, including but not limited to text, graphics, logos, images, software, and code, are the property of the OpenClaw project or its licensors and are protected by copyright, trademark, and other intellectual property laws.']
        },
        {
          heading: '6. Open Source License',
          paragraphs: ['This software is released under an open source license. You may:'],
          items: ['Freely use, copy, modify, and distribute this software', 'Use this software for commercial purposes subject to the license terms', 'Modified versions must retain the original license notice']
        },
        {
          heading: '7. Service Availability',
          paragraphs: ['We strive to ensure the continuous availability of the Service, but do not guarantee that the Service will be uninterrupted, timely, secure, or error-free. The Service may be temporarily interrupted due to maintenance, updates, or other reasons.']
        },
        {
          heading: '8. User Content',
          paragraphs: ['Any content you generate through your use of the Service (excluding pre-existing content of the Service) remains yours. By submitting content, you grant us the right to use, modify, display, and distribute that content to provide and improve the Service.']
        },
        {
          heading: '9. Privacy Protection',
          paragraphs: ['Your privacy is important to us. Please refer to our {link} to understand how we collect, use, and protect your personal information.'],
          link: { text: 'Privacy Policy', href: '/legal/privacy' }
        },
        {
          heading: '10. Disclaimer',
          paragraphs: ['The Service is provided on an "as is" and "as available" basis without any express or implied warranties. Please refer to our {link} for more details.'],
          link: { text: 'Disclaimer', href: '/legal/disclaimer' }
        },
        {
          heading: '11. Limitation of Liability',
          paragraphs: ['In no event shall the OpenClaw project and its developers be liable for any indirect, incidental, special, or consequential damages arising from the use or inability to use the Service, even if we have been advised of the possibility of such damages.']
        },
        {
          heading: '12. Termination',
          paragraphs: ['We reserve the right to terminate or suspend your access to the Service at any time, with or without cause, and with or without notice. Upon termination, all your rights to use the Service will immediately cease.']
        },
        {
          heading: '13. Governing Law',
          paragraphs: ['These Terms of Service are governed by the laws of the People\'s Republic of China. Any disputes arising from these Terms of Service shall be resolved through friendly negotiation; if negotiation fails, you may file a lawsuit with a people\'s court having jurisdiction.']
        },
        {
          heading: '14. Changes to Terms',
          paragraphs: ['We reserve the right to modify these terms at any time. Modified terms will be posted on this page with the date of modification. Continued use of the Service constitutes acceptance of the modified terms.']
        },
        {
          heading: '15. Contact Us',
          paragraphs: ['If you have any questions about these Terms of Service, please contact us at:', 'Email: 5003698@qq.com']
        }
      ]
    },
    privacyDetail: {
      title: 'Privacy Policy',
      updateTime: 'Last Updated: March 25, 2026',
      sections: [
        {
          heading: '1. Introduction',
          paragraphs: ['OpenClaw Monitoring System (hereinafter referred to as "we") takes your privacy protection very seriously. This Privacy Policy is intended to explain how we collect, use, store, and protect your personal information. By using our services, you agree to the terms of this Privacy Policy.']
        },
        {
          heading: '2. Information Collection',
          paragraphs: ['We may collect the following types of information:'],
          richItems: [
            { bold: 'Account Information', text: ': including your email address, username, and other registration information' },
            { bold: 'Device Information', text: ': including device type, operating system, browser type, etc.' },
            { bold: 'Usage Data', text: ': including frequency of service use, feature preferences, etc.' },
            { bold: 'Log Information', text: ': including access time, IP address, and other server logs' }
          ]
        },
        {
          heading: '3. Information Use',
          paragraphs: ['We use the collected information for the following purposes:'],
          items: ['Provide, maintain, and improve our services', 'Process your requests and transactions', 'Send service-related notifications and updates', 'Monitor and analyze usage trends to optimize user experience', 'Prevent fraud, abuse, and security threats', 'Comply with legal obligations']
        },
        {
          heading: '4. Information Sharing',
          paragraphs: ['We do not sell, rent, or otherwise disclose your personal information to third parties unless:'],
          items: ['We have your explicit consent', 'Required by law or legal process', 'To protect our rights, property, or safety', 'Working with trusted service providers to deliver services (under confidentiality agreements)']
        },
        {
          heading: '5. Data Storage',
          paragraphs: ['Your information is stored in secure databases, and we take reasonable technical and organizational measures to protect your information from unauthorized access, use, or disclosure. Data retention periods are determined based on your settings and legal requirements.']
        },
        {
          heading: '6. Cookie Usage',
          paragraphs: ['We use cookies and similar technologies to improve user experience, analyze usage, and provide personalized content. You can manage cookie preferences through your browser settings.']
        },
        {
          heading: '7. User Rights',
          paragraphs: ['You have the following rights regarding your personal information:'],
          richItems: [
            { bold: 'Right of Access', text: ': request to view the information we hold about you' },
            { bold: 'Right of Rectification', text: ': request to correct inaccurate or incomplete information' },
            { bold: 'Right of Deletion', text: ': request to delete your personal information' },
            { bold: 'Right of Objection', text: ': object to the processing of your personal information' },
            { bold: 'Right to Data Portability', text: ': request to receive your information in a structured format' }
          ]
        },
        {
          heading: '8. Data Security',
          paragraphs: ['We employ industry-standard security measures to protect your information, including but not limited to:'],
          items: ['SSL/TLS encrypted transmission', 'Encrypted data storage', 'Access control and authentication', 'Regular security audits']
        },
        {
          heading: '9. Children\'s Privacy',
          paragraphs: ['Our services are not directed to children under 13. If we discover that we have inadvertently collected personal information from a child, we will take steps to delete that information.']
        },
        {
          heading: '10. Policy Changes',
          paragraphs: ['We may update this Privacy Policy from time to time. Significant changes will be communicated through website notifications or email. Continued use of our services constitutes acceptance of the updated policy.']
        },
        {
          heading: '11. Contact Us',
          paragraphs: ['If you have any questions about this Privacy Policy, please contact us at:', 'Email: 5003698@qq.com']
        }
      ]
    },
    disclaimerDetail: {
      title: 'Disclaimer',
      updateTime: 'Last Updated: March 25, 2026',
      sections: [
        {
          heading: '1. Project Nature',
          paragraphs: ['OpenClaw Monitoring System is an open-source software project designed to provide agent status monitoring functionality. This software is provided "as is" without any express or implied warranties.']
        },
        {
          heading: '2. Scope of Disclaimer',
          paragraphs: ['To the maximum extent permitted by law, the project developers are not responsible for:'],
          items: ['The accuracy, reliability, or suitability of the software', 'Any loss or damage resulting from the use or inability to use the software', 'Any errors, defects, or inaccuracies that may exist in the software', 'Service interruptions caused by network connection issues, server failures, or other technical problems', 'Issues or availability of third-party services or content']
        },
        {
          heading: '3. Risk of Use',
          paragraphs: ['Any risk arising from your use of this software is borne by you. You should independently assess whether this software is suitable for your needs and are responsible for the results of using this software.']
        },
        {
          heading: '4. Data Security',
          paragraphs: ['While this project is committed to protecting user data security, it does not guarantee absolute data security. Users should back up important data on their own and take appropriate security measures.']
        },
        {
          heading: '5. Open Source License',
          paragraphs: ['This software is released under an open source license. Users may freely use, modify, and distribute this software in compliance with the license terms.']
        },
        {
          heading: '6. Limitation of Liability',
          paragraphs: ['In no event shall the project developers\' liability exceed the remediation of defects in the software itself, and they shall not be liable for any indirect, incidental, special, or consequential damages to users.']
        },
        {
          heading: '7. Governing Law',
          paragraphs: ['This Disclaimer is governed by the laws of the People\'s Republic of China. If any provision of this Disclaimer is found to be invalid or unenforceable, the remaining provisions shall remain in effect.']
        },
        {
          heading: '8. Contact Information',
          paragraphs: ['If you have any questions or suggestions, please contact us at:', 'Email: 5003698@qq.com']
        }
      ]
    }
  },
  emptyState: {
    welcome: 'Welcome to OpenClaw Monitoring System',
    description: 'You have not bound any Gateway yet. Please bind your OpenClaw Gateway first to start monitoring agent status',
    bindNow: 'Bind Gateway Now'
  },
  admin: {
    dashboard: 'Admin Dashboard',
    underDevelopment: 'This feature is under development...'
  },
  advertisement: {
    imageLoadFailed: 'Failed to load advertisement image'
  }
}
