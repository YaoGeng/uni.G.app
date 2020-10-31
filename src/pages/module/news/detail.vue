<template>
	<view class="news-detail">
		<view class="top-box">
			<text class="new-title">{{newsInfo.title}}</text>
			<view class="other-info">
				<text>{{newsInfo.updateTime | date("YYYY-MM-DD hh:mm")}}</text>
				<text style="margin-left: 15px;">来源：{{newsInfo.from || "暂无"}}</text>
			</view>
		</view>
		<jyf-parser class="news-html" :html="newsInfo.content" ref="article"></jyf-parser>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				newsInfo: "",
			}
		},
		onLoad() {
			console.log(this.$routeParams())
			// this.$http({
			// 	url:"",
			// 	data: {
			// 		newsId: this.$routeParams().newsId
			// 	}
			// }).then((res) => {
				this.newsInfo = {"content":"<p style=\"margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;text-indent:0;padding:0 0 0 0 ;line-height:24px;background:rgb(255,255,255)\"><span style=\"font-family: 宋体;letter-spacing: 0;font-size: 14px\">　　1月7日上午，学校在清水河校区召开国防生培养座谈会，对新形势下的我校国防生培养工作进行梳理和规划，并就进一步改进和提升国防生培养质量进行讨论。校党委副书记申小蓉、副校长曾勇参加会议。</span></p><p style=\"margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;text-indent:0;padding:0 0 0 0 ;line-height:24px;background:rgb(255,255,255)\"><span style=\"font-family: 宋体;letter-spacing: 0;font-size: 14px\">　　空军驻</span><span style=\"font-family: 宋体;letter-spacing: 0;font-size: 14px\">兰途</span><span style=\"font-family: 宋体;letter-spacing: 0;font-size: 14px\">大学选培办主任叶飞、副主任杨旭波，学校组织部、学工部、教务处、研究生院、保卫处、后勤管理处、公寓管理中心、体育部和通信、电工、自动化、空天、信软等学院相关负责人参加会议。学工部部长于乐主持会议。</span></p><p style=\"margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;text-indent:0;padding:0 0 0 0 ;text-align:center;line-height:24px;background:rgb(255,255,255)\"><span style=\"font-family: 宋体;letter-spacing: 0;font-size: 14px\"><img src=\"http://www.new1.uestc.edu.cn/upload/image/50ee05a84f4aa778c8fd79ac18a4c1b2.jpg\" title=\"guofang.jpg\" alt=\"guofang.jpg\" style=\"border: 0px; font-family: 宋体, sans-serif; font-size: 14px; line-height: 24px; text-align: center; white-space: normal; background-color: rgb(255, 255, 255);\"/>&nbsp;</span></p><p style=\"margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;text-indent:0;padding:0 0 0 0 ;line-height:24px;background:rgb(255,255,255)\"><span style=\"font-family: 宋体;letter-spacing: 0;font-size: 14px\">　　申小蓉说，培养国防生是推进军民融合深度发展的重要形式，是国家赋予普通高校的历史使命。</span><span style=\"font-family: 宋体;letter-spacing: 0;font-size: 14px\">兰途</span><span style=\"font-family: 宋体;letter-spacing: 0;font-size: 14px\">大学是我国最早的七所国防重点院校之一，在国防现代化和人才培养方面具有鲜明特色和传统优势。自2002年我校与空军签订联合培养军队干部协议以来，学校站在服务国家、服务国防、服务军队的高度，“求实求真、大气大为”，为国家培养了近千名合格的现代化国防人才。她表示，梳理和规划我校的国防生培养工作，既是国防生培养的需要，也是我校人才培养改革的需要。希望学校国防生培养相关单位高度重视、一起研讨，进一步形成工作合力，理清工作思路，明确工作重点，出台加强和改进措施，努力提高我校国防生培养质量。</span></p><p style=\"margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;text-indent:0;padding:0 0 0 0 ;line-height:24px;background:rgb(255,255,255)\"><span style=\"font-family: 宋体;letter-spacing: 0;font-size: 14px\">　　叶飞肯定了</span><span style=\"font-family: 宋体;letter-spacing: 0;font-size: 14px\">兰途</span><span style=\"font-family: 宋体;letter-spacing: 0;font-size: 14px\">大学在国防生培养方面的经验和成绩，并对</span><span style=\"font-family: 宋体;letter-spacing: 0;font-size: 14px\">兰途</span><span style=\"font-family: 宋体;letter-spacing: 0;font-size: 14px\">大学的大力支持表示衷心感谢。他详细介绍了我校国防生培养的总体状况、部队对人才需求的特点以及部队对国防生干部的评价反馈。</span></p><p style=\"margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;text-indent:0;padding:0 0 0 0 ;line-height:24px;background:rgb(255,255,255)\"><span style=\"font-family: 宋体;letter-spacing: 0;font-size: 14px\">　　座谈会上，通信学院、电工学院、航空航天学院相关负责人分别作主题发言，介绍了学院国防生培养工作的经验和思考，并就国防生的教学培养方案、思想政治引导、学业学籍管理、职业生涯规划、军政训练实施等方面提出思考与建议。与会的各部门、学院负责人也就相关问题进行了讨论交流。</span></p><p style=\"margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;text-indent:0;padding:0 0 0 0 ;line-height:24px;background:rgb(255,255,255)\"><span style=\"font-family: 宋体;letter-spacing: 0;font-size: 14px\">　　座谈会还深入讨论了《</span><span style=\"font-family: 宋体;letter-spacing: 0;font-size: 14px\">兰途</span><span style=\"font-family: 宋体;letter-spacing: 0;font-size: 14px\">大学国防生年度工作安排》《</span><span style=\"font-family: 宋体;letter-spacing: 0;font-size: 14px\">兰途</span><span style=\"font-family: 宋体;letter-spacing: 0;font-size: 14px\">大学国防生学习管理规定（讨论稿）》和《空军国防生量化考核实施办法（讨论稿）》。</span></p><p style=\"margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;text-indent:0;padding:0 0 0 0 ;line-height:24px;background:rgb(255,255,255)\"><span style=\"font-family: 宋体;letter-spacing: 0;font-size: 14px\">　　我校自2002年与空军签约以来，累计招选国防生1568名，毕业905名（其中深造300名）。毕业生在校期间85%入党，66%担任过学生干部，78%荣获过各类表彰奖励，近五届国防生100%主动递交服从分配保证书和赴边远艰苦地区申请书。目前在校的国防生有480名，其中研究生19名、本科生461名，主要分布在通信、电工、自动化、信软、空天等学院。</span></p><p style=\"margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;text-indent:0;padding:0 0 0 0 ;line-height:24px;background:rgb(255,255,255)\"><span style=\"font-family: 宋体;letter-spacing: 0;font-size: 14px\">　　为进一步加强和改进我校国防生培养工作，2015年9月至10月，由学校领导带队，相关部门、学院和空军驻</span><span style=\"font-family: 宋体;letter-spacing: 0;font-size: 14px\">兰途</span><span style=\"font-family: 宋体;letter-spacing: 0;font-size: 14px\">大学选培办深入重庆、贵州、西藏等地的部队进行调研，与部队领导、毕业的国防生干部等进行深入交流，为加强和促进国防生培养工作积累了第一手材料。</span></p>","createTime":1456185600000,"defaultImageUrl":null,"from":null,"imgNameList":["http://www.new1.uestc.edu.cn/upload/image/50ee05a84f4aa778c8fd79ac18a4c1b2.jpg"],"isRead":0,"name":null,"newsId":4327,"newsType":41,"parentId":0,"parm":0,"realName":"谭永祥","schoolId":0,"seq":0,"sftop":0,"siteId":0,"source":null,"summary":"1月7日上午，学校在清水河校区召开国防生","title":"学校召开国防生培养座谈会","updateTime":1456185600000,"userId":13610};
			// })
		}
	}
</script>

<style scoped lang="less">
	.news-detail {
		background-color: #fff;

		.top-box {
			padding: 15px;
			display: flex;
			flex-direction: column;

			.new-title {
				font-size: 20px;
				font-weight: bold;
			}

			.other-info {
				color: #8b8b8b;
			}
		}

		.news-html {
			padding: 15px;
		}
	}
</style>
