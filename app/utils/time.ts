import { differenceInMilliseconds, format } from 'date-fns'

export function getLocaleDatetime(date: string | Date) {
	return format(date, 'yyyy年M月d日 E HH:mm:ss')
}

export function isTimeDiffSignificant(
	date1?: string | Date,
	date2?: string | Date,
	// 对于时间差的敏感程度，0~1 之间
	threshold: number = 0.6,
) {
	if (!date1 || !date2)
		return false

	const now = Date.now()

	const diff1 = differenceInMilliseconds(now, date1)
	const diff2 = differenceInMilliseconds(now, date2)
	return diff1 / diff2 < threshold || diff2 / diff1 < threshold
}

const timeIntervals = [
	{ label: '世纪', threshold: 1000 * 60 * 60 * 24 * 365.2422 * 100 },
	{ label: '年', threshold: 1000 * 60 * 60 * 24 * 365.2422 },
	{ label: '个月', threshold: 1000 * 60 * 60 * 24 * 30.44 },
	{ label: '天', threshold: 1000 * 60 * 60 * 24 },
	{ label: '小时', threshold: 1000 * 60 * 60 },
	{ label: '分', threshold: 1000 * 60 },
	{ label: '秒', threshold: 1000 },
]

export function timeElapse(date: Date | string, maxDepth = 2) {
	let timeString = ''
	let msecRemained = differenceInMilliseconds(Date.now(), date)
	for (const interval of timeIntervals) {
		const count = Math.floor(msecRemained / interval.threshold)
		if (count <= 0)
			continue
		timeString += `${count}${interval.label}`
		msecRemained -= count * interval.threshold
		if (--maxDepth <= 0)
			break
	}
	return timeString || '刚刚'
}
