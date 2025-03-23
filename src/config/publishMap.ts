  type CollegeMap = {
    [key: number]: string;
  };
  type CollegeMapReverse = {
    [key: string] : number;
  }
  type JobTypeMap = {
    [key: number]: string;
  };
  type JobTypeMapReverse = {
    [key: string] : number;
  }
  type DegreeMap = {
    [key: number]: string;
  };
  type DegreeMapReverse = {
    [key: string] : number;
  }

// 招聘信息发布源自的学院
export const collegeMap: CollegeMap = {
    0: '不限',
    1: '文学院',
    2: '历史学院',
    3: '文化遗产学院',
    4: '经济管理学院',
    5: '公共管理学院(应急管理学院)',
    6: '外国语学院',
    7: '法学院(知识产权学院)',
    8: '马克思主义学院',
    9: '哲学学院',
    10: '新闻传播学院',
    11: '艺术学院',
    12: '安莱学院',
    13: '数学学院',
    14: '物理学院',
    15: '化学与材料科学学院',
    16: '地质学系',
    17: '城市与环境学院',
    18: '生命科学学院',
    19: '医学院',
    20: '信息科学与技术学院(软件学院)',
    21: '化工学院',
    22: '食品科学与工程学院'
}
export const collegeMapReverse: CollegeMapReverse = {
    '不限': 0,
    '文学院': 1,
    '历史学院': 2,
    '文化遗产学院': 3,
    '经济管理学院': 4,
    '公共管理学院(应急管理学院)': 5,
    '外国语学院': 6,
    '法学院(知识产权学院)': 7,
    '马克思主义学院': 8,
    '哲学学院': 9,
    '新闻传播学院': 10,
    '艺术学院': 11,
    '安莱学院': 12,
    '数学学院': 13,
    '物理学院': 14,
    '化学与材料科学学院': 15,
    '地质学系': 16,
    '城市与环境学院': 17,
    '生命科学学院': 18,
    '医学院': 19,
    '信息科学与技术学院(软件学院)': 20,
    '化工学院': 21,
    '食品科学与工程学院': 22
}
// 工作的类型
export const jobTypeMap: JobTypeMap = {
    0: '综合类',
    1: '辅导员类',
    2: '教师类',
    3: '后勤(服务)类',
    4: '科研类',
    5: '教辅类',
    6: '管理类'
}
export const jobTypeMapReverse: JobTypeMapReverse = {
    '综合类': 0,
    '辅导员类': 1,
    '教师类': 2,
    '后勤(服务)类': 3,
    '科研类': 4,
    '教辅类': 5,
    '管理类': 6
}
// 要求最低学历
export const degreeMap: DegreeMap = {
    0: '不限',
    1: '本科',
    2: '硕士',
    3: '博士'
}
export const degreeMapReverse: DegreeMapReverse = {
    '不限': 0,
    '本科': 1,
    '硕士': 2,
    '博士': 3
}