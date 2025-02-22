/*
 * @Author: czy0729
 * @Date: 2022-11-01 20:41:48
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-11-01 20:42:08
 */
import { ScrollView } from 'react-native'

export function scrollToX(
  scrollView: ScrollView,
  data: readonly any[],
  value: any,
  width = 50,
  mutiple = false
) {
  try {
    setTimeout(() => {
      if (scrollView && value) {
        let index = 0
        if (mutiple) {
          data.forEach(items => {
            const idx = items.findIndex((i: any) => i == value)
            if (idx > index) index = idx
          })
        } else {
          index = data.findIndex(i => i == value)
        }

        if (index >= 4) {
          setTimeout(() => {
            scrollView.scrollTo(
              {
                x: (index - 2) * width,
                y: 0,
                animated: true
              },
              1
            )
          }, 80)
        }
      }
    }, 160)
  } catch (error) {}
}
