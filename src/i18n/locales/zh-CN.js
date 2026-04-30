export default {
  common: {
    loading: '加载中...',
    confirm: '确认',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    add: '添加',
    search: '搜索',
    reset: '重置',
    success: '操作成功',
    failed: '操作失败',
    noData: '暂无数据',
    login: '登录',
    logout: '登出',
    register: '注册',
    guest: '访客模式',
    profile: '个人信息',
    monitor: '监控系统',
    chinese: '中文',
    english: 'English',
    languageSwitch: '中英文切换',
    online: '在线',
    offline: '离线',
    viewStatus: '查看状态',
    bindSuccess: '绑定成功',
    bindSuccessMsg: '绑定成功！智能体已添加到列表',
    pageInitFailed: '页面初始化失败，请刷新页面重试',
    setToken: '设置 Token',
    setTokenDev: '设置Token功能开发中',
    accountSwitchOk: '账号切换成功',
    monitorNav: '监控',
    confirmDelete: '确定',
    unknown: '未知'
  },
  auth: {
    email: '邮箱',
    password: '密码',
    confirmPassword: '确认密码',
    phone: '手机号',
    verificationCode: '验证码',
    sendCode: '发送验证码',
    codeSent: '验证码已发送',
    loginSuccess: '登录成功',
    registerSuccess: '注册成功',
    loginRequired: '注册登录后才能使用此功能',
    passwordStrength: '密码需至少8位,包含字母和数字',
    emailRegistered: '该邮箱已注册,请直接登录',
    codeExpired: '验证码已过期,请重新获取',
    resetPassword: '重置密码',
    enterEmail: '请输入邮箱',
    newPassword: '新密码',
    enterNewPassword: '请输入新密码',
    reEnterPassword: '请再次输入密码',
    backToLogin: '返回登录',
    passwordRequired: '请输入密码',
    passwordMinLength: '密码长度至少8位',
    passwordMustContain: '密码必须包含字母和数字',
    passwordMismatch: '两次输入的密码不一致',
    emailRequired: '请输入邮箱',
    emailInvalid: '请输入有效的邮箱地址',
    resetSuccess: '密码重置成功',
    resetFailed: '密码重置失败',
    welcomeBack: '欢迎回到 OpenClaw 监控系统',
    noAccount: '还没有账号?',
    forgotPassword: '忘记密码?',
    loginFailed: '登录失败',
    loginFailedNetwork: '登录失败，请检查网络连接',
    createAccount: '创建您的 OpenClaw 监控系统账号',
    hasAccount: '已有账号?',
    phoneInvalid: '请输入有效的手机号',
    codeRequired: '请输入验证码',
    codeSixDigits: '验证码为6位数字',
    enterEmailFirst: '请先输入邮箱',
    codeSentToEmail: '验证码已发送到您的邮箱，请注意查收',
    codeSendFailed: '验证码发送失败',
    registerFailed: '注册失败'
  },
  gateway: {
    bind: '绑定 Gateway',
    unbind: '解绑 Gateway',
    testConnection: '测试连接',
    connectionSuccess: '连接成功',
    connectionFailed: '连接失败',
    gatewayUrl: 'Gateway 地址',
    token: 'Token',
    agentName: '智能体名称',
    bindSuccess: '绑定成功',
    bindFailed: '绑定失败',
    maxAgents: '已达到绑定上限(最多8个智能体)',
    discovering: '正在发现智能体...',
    discovered: '发现智能体',
    step1: '填写配置',
    step2: '测试连接',
    step3: '完成绑定',
    inputAgentName: '请输入智能体名称',
    inputGatewayUrl: 'https://gateway.example.com',
    inputToken: '请输入Token',
    nextStep: '下一步',
    prevStep: '上一步',
    complete: '完成',
    connectionStatus: '连接状态',
    connectionLatency: '连接延迟',
    connectionMessage: '消息',
    ms: 'ms',
    agentNameRequired: '请输入智能体名称',
    gatewayUrlRequired: '请输入Gateway地址',
    urlInvalid: '请输入有效的URL',
    tokenRequired: '请输入Token',
    testBeforeBind: '请先确保测试连接成功后再进行绑定',
    testFailed: '连接测试失败',
    paramError: '参数错误: ',
    checkGatewayToken: '请检查输入的Gateway地址和Token',
    authFailed: '认证失败: Token无效',
    gatewayNotFound: 'Gateway地址不存在或无法访问',
    serverError: '服务器错误: ',
    networkError: '网络错误: 无法连接到Gateway',
    configError: '请求配置错误: '
  },
  monitor: {
    status: '状态',
    running: '运行中',
    offline: '离线',
    busy: '忙碌',
    idle: '空闲',
    working: '工作中',
    sessions: '会话数',
    tokenUsage: 'Token 使用',
    onlineTime: '在线时长',
    memory: '内存占用',
    messages: '消息统计',
    tasks: '任务列表',
    channels: '渠道状态',
    kbi: 'KBI 指标',
    boundAgents: '已绑定的智能体',
    gatewayAddress: 'Gateway地址:',
    type: '类型:',
    mainAgent: '主智能体',
    boundAt: '绑定时间:',
    deleteConfirm: '确定要删除Gateway "{name}" 吗？此操作将删除该Gateway及其所有智能体数据，不可撤销。',
    deleteTitle: '删除确认',
    deleteSuccess: '删除成功',
    deleteFailed: '删除失败',
    noAgentMsg: '该Gateway下暂无智能体设备，请点击"添加智能体"或"刷新状态"',
    selectedAgent: '已选择智能体: {name}',
    taskList: '任务列表',
    unknownTask: '未知任务',
    completed: '已完成',
    failed: '失败',
    pending: '等待中',
    inProgress: '进行中',
    noTasks: '暂无任务',
    startTime: '开始:',
    endTime: '结束:',
    runStatus: '运行状态',
    memoryUsage: '内存占用',
    messageStats: '消息统计',
    llmModel: '大模型',
    session: '会话',
    progressLabel: '进度：',
    messageLabel: '消息',
    channelStatus: '渠道状态',
    messageColon: '消息:',
    activeColon: '活跃:',
    noChannelData: '暂无渠道数据',
    connected: '已连接',
    disconnected: '断开',
    abnormal: '异常',
    notConfigured: '未配置',
    mainSession: '主会话',
    messageCount: '消息数',
    addAgent: '添加Agent',
    addNewAgent: '添加新Agent',
    agentNameLabel: 'Agent名称',
    close: '关闭',
    unbindConfirm: '确定要解绑 "{name}" 吗?',
    unbindTitle: '确认解绑',
    unbindSuccess: '解绑成功',
    deleteAgentConfirm: '确定要删除这个Agent吗？删除后将无法恢复。',
    testConnectionDev: '测试连接功能开发中',
    editDev: '编辑功能开发中',
    addSuccess: '添加成功',
    notConnected: '未连接',
    operation: '操作',
    boundTime: '绑定时间',
    demoTask1: '记忆存档',
    demoTask2: '团队汇报',
    demoTask3: '团队学习'
  },
  agent: {
    main: '主智能体',
    sub: '子智能体',
    addTab: '+ 添加',
    maxTabs: '最多支持8个智能体标签页',
    switchTab: '切换智能体',
    multiManage: '多Agent管理'
  },
  storage: {
    settings: '数据存储设置',
    retention: '数据保留时长',
    days7: '7 天',
    days30: '30 天',
    days90: '90 天',
    forever: '永久',
    currentUsage: '当前存储占用',
    clearAll: '清除所有本地数据',
    clearConfirm: '确定要清除吗?此操作不可恢复!',
    exportData: '导出历史数据',
    exportSuccess: '导出成功',
    exportFailed: '导出失败',
    dataOperation: '数据操作',
    exportSuccessMsg: '数据导出成功',
    exportFailedMsg: '数据导出失败',
    clearConfirmMsg: '确定要清除所有本地数据吗？此操作不可恢复！',
    clearTitle: '确认清除',
    clearSuccessMsg: '数据已清除',
    clearFailedMsg: '清除失败',
    saveSuccessMsg: '设置已保存'
  },
  legal: {
    disclaimer: '免责声明',
    privacy: '隐私政策',
    terms: '服务条款',
    contact: '联系方式',
    copyright: '© 2026 OpenClaw. All rights reserved.',
    contactTitle: '联系我们',
    contactContent: '如果您有任何疑问或建议，请通过以下方式联系我们：',
    contactEmail: '邮箱：5003698@qq.com',
    termsDetail: {
      title: '服务条款',
      updateTime: '最后更新时间：2026年3月25日',
      sections: [
        {
          heading: '1. 服务协议的接受',
          paragraphs: ['欢迎使用 OpenClaw 监控系统（以下简称"本服务"）。通过访问或使用本服务，您确认您已阅读、理解并同意接受本服务条款的约束。如果您不同意这些条款，请不要使用本服务。']
        },
        {
          heading: '2. 服务描述',
          paragraphs: ['OpenClaw 监控系统是一个开源的智能体状态监控平台，提供以下功能：'],
          items: ['智能体状态实时监控', 'Gateway 设备绑定和管理', '渠道状态追踪', '任务列表管理', '数据存储和导出']
        },
        {
          heading: '3. 用户注册',
          paragraphs: ['使用本服务的某些功能可能需要注册账户。注册时，您同意：'],
          items: ['提供真实、准确、完整的个人信息', '及时更新您的个人信息', '维护您的账户安全，对他人使用您的账户负责', '遵守所有适用的法律法规']
        },
        {
          heading: '4. 用户行为规范',
          paragraphs: ['在使用本服务时，您同意不会：'],
          items: ['违反任何适用的法律法规或规章', '侵犯他人的知识产权或其他合法权益', '发布或传输任何非法、有害、威胁、滥用、骚扰、诽谤、粗俗、淫秽或其他令人反感的内容', '干扰或破坏本服务或连接到本服务的服务器或网络', '未经授权访问本服务的任何部分或其他账户', '使用本服务进行任何商业目的，除非获得明确授权']
        },
        {
          heading: '5. 知识产权',
          paragraphs: ['本服务及其所有内容、功能和特性，包括但不限于文本、图形、标志、图像、软件和代码，均为 OpenClaw 项目或其许可方的财产，受版权、商标和其他知识产权法的保护。']
        },
        {
          heading: '6. 开源许可',
          paragraphs: ['本软件采用开源许可证发布。您可以：'],
          items: ['自由使用、复制、修改和分发本软件', '在遵守许可证条款的前提下将本软件用于商业目的', '修改后的版本必须保留原始许可证声明']
        },
        {
          heading: '7. 服务可用性',
          paragraphs: ['我们努力确保本服务的持续可用性，但不保证服务将不间断、及时、安全或无错误。服务可能会因维护、更新或其他原因而暂时中断。']
        },
        {
          heading: '8. 用户内容',
          paragraphs: ['您对本服务的使用中产生的任何内容（不包括本服务的预置内容）仍归您所有。通过提交内容，您授予我们使用、修改、显示和分发该内容的权利，以便提供和改进本服务。']
        },
        {
          heading: '9. 隐私保护',
          paragraphs: ['您的隐私对我们很重要。请参阅我们的{link}以了解我们如何收集、使用和保护您的个人信息。'],
          link: { text: '隐私政策', href: '/legal/privacy' }
        },
        {
          heading: '10. 免责声明',
          paragraphs: ['本服务按"原样"和"可用"基础提供，不提供任何明示或暗示的保证。请参阅我们的{link}了解更多详情。'],
          link: { text: '免责声明', href: '/legal/disclaimer' }
        },
        {
          heading: '11. 责任限制',
          paragraphs: ['在任何情况下，OpenClaw 项目及其开发者不对因使用或无法使用本服务而导致的任何间接、偶然、特殊或后果性损害承担责任，即使我们已被告知此类损害的可能性。']
        },
        {
          heading: '12. 终止',
          paragraphs: ['我们保留随时终止或暂停您访问本服务的权利，无论是否有原因，无论是否通知。终止后，您对本服务的的所有权利将立即停止。']
        },
        {
          heading: '13. 适用法律',
          paragraphs: ['本服务条款受中华人民共和国法律管辖。因本服务条款引起的任何争议应通过友好协商解决；协商不成的，可向有管辖权的人民法院提起诉讼。']
        },
        {
          heading: '14. 条款变更',
          paragraphs: ['我们保留随时修改这些条款的权利。修改后的条款将在本页面上发布，并注明修改日期。继续使用本服务即表示您接受修改后的条款。']
        },
        {
          heading: '15. 联系我们',
          paragraphs: ['如果您对本服务条款有任何疑问，请通过以下方式联系我们：', '邮箱：5003698@qq.com']
        }
      ]
    },
    privacyDetail: {
      title: '隐私政策',
      updateTime: '最后更新时间：2026年3月25日',
      sections: [
        {
          heading: '1. 引言',
          paragraphs: ['OpenClaw 监控系统（以下简称"我们"）非常重视您的隐私保护。本隐私政策旨在说明我们如何收集、使用、存储和保护您的个人信息。使用我们的服务即表示您同意本隐私政策的条款。']
        },
        {
          heading: '2. 信息收集',
          paragraphs: ['我们可能收集以下类型的信息：'],
          richItems: [
            { bold: '账户信息', text: '：包括您的邮箱地址、用户名等注册信息' },
            { bold: '设备信息', text: '：包括设备类型、操作系统、浏览器类型等' },
            { bold: '使用数据', text: '：包括您使用服务的频率、功能偏好等' },
            { bold: '日志信息', text: '：包括访问时间、IP地址等服务器日志' }
          ]
        },
        {
          heading: '3. 信息使用',
          paragraphs: ['我们使用收集的信息用于以下目的：'],
          items: ['提供、维护和改进我们的服务', '处理您的请求和交易', '发送服务相关通知和更新', '监控和分析使用趋势，优化用户体验', '防范欺诈、滥用和安全威胁', '遵守法律义务']
        },
        {
          heading: '4. 信息共享',
          paragraphs: ['我们不会出售、出租或以其他方式向第三方披露您的个人信息，除非：'],
          items: ['获得您的明确同意', '法律要求或法律程序需要', '为了保护我们的权利、财产或安全', '与可信的服务提供商合作，以提供服务（在保密协议下）']
        },
        {
          heading: '5. 数据存储',
          paragraphs: ['您的信息存储在安全的数据库中，我们采取合理的技术和组织措施来保护您的信息免受未经授权的访问、使用或披露。数据存储期限根据您的设置和法律要求确定。']
        },
        {
          heading: '6. Cookie 使用',
          paragraphs: ['我们使用 Cookie 和类似技术来改善用户体验、分析使用情况和提供个性化内容。您可以通过浏览器设置管理 Cookie 偏好。']
        },
        {
          heading: '7. 用户权利',
          paragraphs: ['您对自己的个人信息享有以下权利：'],
          richItems: [
            { bold: '访问权', text: '：请求查看我们持有的关于您的信息' },
            { bold: '更正权', text: '：请求更正不准确或不完整的信息' },
            { bold: '删除权', text: '：请求删除您的个人信息' },
            { bold: '反对权', text: '：反对处理您的个人信息' },
            { bold: '数据携带权', text: '：请求以结构化格式提供您的信息' }
          ]
        },
        {
          heading: '8. 数据安全',
          paragraphs: ['我们采用行业标准的安全措施来保护您的信息，包括但不限于：'],
          items: ['SSL/TLS 加密传输', '数据加密存储', '访问控制和身份验证', '定期安全审计']
        },
        {
          heading: '9. 儿童隐私',
          paragraphs: ['我们的服务不面向 13 岁以下的儿童。如果我们发现无意中收集了儿童的个人信息，我们将采取步骤删除该信息。']
        },
        {
          heading: '10. 政策变更',
          paragraphs: ['我们可能会不时更新本隐私政策。重大变更将通过网站通知或电子邮件告知您。继续使用我们的服务即表示您接受更新后的政策。']
        },
        {
          heading: '11. 联系我们',
          paragraphs: ['如果您对本隐私政策有任何疑问，请通过以下方式联系我们：', '邮箱：5003698@qq.com']
        }
      ]
    },
    disclaimerDetail: {
      title: '免责声明',
      updateTime: '最后更新时间：2026年3月25日',
      sections: [
        {
          heading: '1. 项目性质',
          paragraphs: ['OpenClaw 监控系统是一个开源软件项目，旨在为用户提供智能体状态监控功能。本软件按"原样"提供，不提供任何明示或暗示的保证。']
        },
        {
          heading: '2. 免责范围',
          paragraphs: ['在法律允许的最大范围内，本项目开发者不对以下任何事项承担责任：'],
          items: ['软件的准确性、可靠性或适用性', '因使用或无法使用本软件而导致的任何损失或损害', '软件中可能存在的任何错误、缺陷或不准确之处', '因网络连接问题、服务器故障或其他技术问题导致的服务中断', '第三方服务或内容的问题或可用性']
        },
        {
          heading: '3. 使用风险',
          paragraphs: ['用户使用本软件所产生的任何风险由用户自行承担。用户应自行评估本软件是否适合其需求，并对使用本软件的结果负责。']
        },
        {
          heading: '4. 数据安全',
          paragraphs: ['虽然本项目致力于保护用户数据安全，但不对数据的绝对安全性做出保证。用户应自行备份重要数据，并采取适当的安全措施。']
        },
        {
          heading: '5. 开源许可',
          paragraphs: ['本软件采用开源许可证发布，用户可以在遵守许可证条款的前提下自由使用、修改和分发本软件。']
        },
        {
          heading: '6. 责任限制',
          paragraphs: ['在任何情况下，本项目开发者的责任仅限于软件本身的缺陷修复，不对用户的间接、偶然、特殊或后果性损害承担责任。']
        },
        {
          heading: '7. 法律适用',
          paragraphs: ['本免责声明受中华人民共和国法律管辖。如本免责声明的任何条款被认定为无效或不可执行，其余条款仍然有效。']
        },
        {
          heading: '8. 联系方式',
          paragraphs: ['如有任何疑问或建议，请通过以下方式联系我们：', '邮箱：5003698@qq.com']
        }
      ]
    }
  },
  emptyState: {
    welcome: '欢迎使用 OpenClaw 监控系统',
    description: '您还没有绑定任何 Gateway,请先绑定您的 OpenClaw Gateway 以开始监控智能体状态',
    bindNow: '立即绑定 Gateway'
  },
  admin: {
    dashboard: '管理员控制台',
    underDevelopment: '此功能正在开发中...'
  },
  advertisement: {
    imageLoadFailed: '广告图片加载失败'
  }
}
