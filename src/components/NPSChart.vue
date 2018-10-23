<template>
  <div class='chartDiv'>
    <div>
      <img src='../assets/nps-icon.png'
           srcset='../assets/nps-icon@2x.png 2x, ../assets/nps-icon@3x.png 3x'
           class='nps-icon'>
    </div>
    <div class='chartHeader'>Net Promoter Score (NPS)</div>
    <hr />
    <div class='chartResolution'></div>
    <div class='npsStats'>
      <span>
        <div class='npsScore'
             v-text='currentNpsScore.nps' v-if="currentNpsScore.nps">
        </div>
        <div class='npsScore' v-else>-</div>
        <div class='label npsScore'>NPS</div>
      </span>
      <span>
        <div class='promoters'
             v-text='currentNpsScore.promoters + "%"'
             v-if='currentNpsScore.promoters !== null'>
        </div>
        <div v-else>-</div>
        <div class='label promoters'>Promoters</div>
      </span>
      <span>
        <div class='passives'
             v-text='currentNpsScore.passives + "%"'
             v-if='currentNpsScore.passives !== null'>
        </div>
        <div v-else>-</div>
        <div class='label passives'>Passives</div>
      </span>
      <span>
        <div class='detractors'
             v-text='currentNpsScore.detractors'
             v-if='currentNpsScore.detractors !== null'>
        </div>
        <div v-else>-</div>
        <div class='label detractors'>Detractors</div>
      </span>
    </div>
    <div class='chartContainer'>
      <canvas id='line-chart' height='100'></canvas>
    </div>
    <div v-if='showTooltip' id='npsTooltip' v-bind:style="{ left: tooltipX, top: tooltipY }">
      <div class="date">1st {{ tooltipNpsScore.month }}, {{ tooltipNpsScore.year }}</div>
      <div class="npsTooltipScore">NPS: {{ tooltipNpsScore.nps }}</div>
      <div class="date">Promoters: {{ tooltipNpsScore.promoters }}&percnt;</div>
      <div class="date">Passives: {{ tooltipNpsScore.passives }}&percnt;</div>
      <div class="date">Detractors: {{ tooltipNpsScore.detractors }}&percnt;</div>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js'

export default {
  data () {
    return {
      npsResponses: null, // From the API
      npsScores: null, // Calculated from the API data
      currentNpsScore: { // To display in the widget
        year: '',
        month: '',
        nps: null,
        promoters: null,
        passives: null,
        detractors: null
      },
      resolution: 'month', // Default to month resolution (not used currently),
      showTooltip: false,
      tooltipNpsScore: {
        date: '',
        nps: null,
        promoters: null,
        passives: null,
        detractors: null
      },
      tooltipX: 0,
      tooltipY: 0
    }
  },
  watch: {
    npsResponses: function (newNpsResponses, oldNpsResponses) {
      // TOOD: move this out into a function for month resolution?
      let dataLabels = []
      let dataScores = []
      let npsScores = []

      // Sort the data into a suitable format.
      let npsResponses = this.getNpsDateStructure(newNpsResponses)

      // Generate the NPS data for each data point on the graph.
      // Since this is month resolution, the labels + scores correspond to months.
      let years = Object.keys(npsResponses)
      years.sort()

      for (let i = 0; i < years.length; i++) {
        let year = years[i]
        let months = Object.keys(npsResponses[year])
        months.sort()

        for (let j = 0; j < months.length; j++) {
          let month = months[j]
          let label = this.getMonthStr(month)
          // If this is the first label for the graph, we want to add the year
          // as a suffix, using the last two digits of the year.
          if (j === 0) {
            label = `${label} '${year.substring(2, 4)}`
          }
          dataLabels.push(label)
          let scores = npsResponses[year][month].map((value) => value.nps)
          dataScores.push(scores)
          let npsScore = this.calculateNpsScore(scores)
          npsScore = Object.assign(npsScore, {
            year: year,
            month: this.getFullMonthStr(month)
          })
          npsScores.push(npsScore)
        }
      }

      // this.npsScores = dataScores.map(this.calculateNpsScore)
      this.npsScores = npsScores
      // Assign the last data point as the "current" NPS score.
      // These values will show up on the widget above the chart.
      this.currentNpsScore = this.npsScores[this.npsScores.length - 1]
      let dataPoints = this.npsScores.map((score) => score.nps)

      let ctx = document.getElementById('line-chart')
      let vueInstance = this

      /* eslint-disable no-unused-vars */
      let chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: dataLabels,
          datasets: [{
            data: dataPoints,
            pointRadius: 4,
            pointHoverRadius: 4,
            pointBackgroundColor: '#ffffff',
            pointHoverBackgroundColor: '#068ccc',
            label: 'Africa',
            borderColor: '#068ccc',
            borderWidth: 1,
            fill: false,
            lineTension: 0
          }]
        },
        options: {
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              gridLines: {
                drawTicks: false
              },
              display: true,
              ticks: {
                padding: 10
              }
            }],
            yAxes: [{
              gridLines: {
                drawTicks: false
              },
              display: true,
              ticks: {
                padding: 10,
                suggestedMin: -60,
                suggestedMax: +60,
                stepSize: 60
              }
            }]
          },
          tooltips: {
            enabled: false,
            custom: function (tooltipModel) {
              // Hide if there is no tooltip (usually when moving the mouse away from the hover)
              if (tooltipModel.opacity === 0) {
                vueInstance.showTooltip = false
                return
              }

              let position = this._chart.canvas.getBoundingClientRect()
              // TODO: can't figure out a reliable way to calculate the positioning yet.
              // vueInstance.tooltipX = position.left + tooltipModel.caretX + 'px'
              // vueInstance.tooltipY = position.top + tooltipModel.caretY + 'px'
              // vueInstance.tooltipX = tooltipModel.caretX + 100 + 'px'
              vueInstance.tooltipY = tooltipModel.caretY + 100 + 'px'
              vueInstance.tooltipX = tooltipModel.caretX + 'px'
              // vueInstance.tooltipY = tooltipModel.caretY + 'px'

              let dataPointIndex = tooltipModel.dataPoints[0].index // index of hover
              // Retrieve the data that is referenced by the tooltip.
              // This is found in the "npsScores" array, with indices lining up
              // to the data points on the X plane.
              vueInstance.tooltipNpsScore = vueInstance.npsScores[dataPointIndex]

              vueInstance.showTooltip = true
            }
          }
        }
      })
      /* eslint-enable no-unused-vars */
    }
  },
  beforeCreate: async function () {
    if (!this.$store.getters.authenticated) {
      this.$router.push({name: 'login'})
    }

    let apiRoot = process.env.ROOT_API
    // console.log(`yes! ${apiRoot}`)
    try {
      // Only return data for Jan - May 2018.
      // In a real app this would not be hardcoded like this, but for the
      // exercise it will suffice.
      let response = await this.$http.get(
        `${apiRoot}nps?start_date=1/1/2018&end_date=31/05/2018`,
        {
          headers: {'Access-Control-Allow-Origin': '*'}
        }
      )
      // console.log(response.data)
      this.npsResponses = response.data.nps
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    getNpsDateStructure: function (npsResponses) {
      /*
      Sort the data into a suitable format for processing the monthly resolution chart.
      The final structure will look something like this:
      {
        2018: {  // Year
          1: [{  // Month
            day: 10, // Day
            nps: 5  // NPS
          }]
        }
      }
      We don't necessarily need the day of the response for the monthly resolution,
      but we keep it in case it becomes necessary later.
      */

      let nspResponseData = {}

      npsResponses.forEach(npsResponse => {
        let year = npsResponse.year
        let month = npsResponse.month
        let day = npsResponse.day
        let nps = npsResponse.nps

        let yearData
        let monthData

        if (!nspResponseData.hasOwnProperty(year)) {
          yearData = {}
          nspResponseData[year] = yearData
        } else {
          yearData = nspResponseData[year]
        }

        if (!yearData.hasOwnProperty(month)) {
          monthData = []
          yearData[month] = monthData
        } else {
          monthData = yearData[month]
        }

        let npsData = {
          day: day,
          nps: nps
        }
        monthData.push(npsData)
      })
      return nspResponseData
    },
    calculateNpsScore: function (responses) {
      /*
      Calculate the NPS (Net Promoter Score) from the provided responses.
      See https://www.surveymonkey.com/mp/net-promoter-score-calculation/
      */
      let numResponses = responses.length
      let numDetractors = 0
      let numPassives = 0
      let numPromoters = 0

      responses.forEach((response) => {
        if (response >= 0 && response <= 6) {
          numDetractors++
        } else if (response >= 7 && response <= 8) {
          numPassives++
        } else if (response >= 9 && response <= 10) {
          numPromoters++
        } else {
          // Invalid response - ignore.
        }
      })

      let promoters = ((numPromoters / numResponses) * 100).toFixed(1)
      let passives = ((numPassives / numResponses) * 100).toFixed(1)
      let detractors = ((numDetractors / numResponses) * 100).toFixed(1)

      return {
        nps: Math.round(promoters - detractors),
        promoters: promoters,
        passives: passives,
        detractors: detractors
      }
    },
    getMonthStr: function (monthNum) {
      // Just return the first three chars of the full month name.
      return this.getFullMonthStr(monthNum).substring(0, 3)
    },
    getFullMonthStr: function (monthNum) {
      const monthNames = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
      ]
      return monthNames[monthNum - 1]
    }
  }
}
</script>

<style scoped>
.chartDiv {
  border: solid 1px #e6e6e6;
  background-color: #ffffff;
  position: absolute;
  margin: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 723px;
  height: 488px;
  box-shadow: 0px 1px 5px 0 rgba(0, 1, 1, 0.1);
  padding-left: 84px;
  padding-right: 84px;
  padding-top: 60px;
  padding-bottom: 60px;
  box-sizing: border-box;
  text-align: center;
}

.chartDiv hr {
  display: block;
  height: 1;
  border: 0;
  border-top: 1px solid #ccc;
  margin: 1em 0;
  margin-left: auto;
  margin-right: auto;
  padding: 0;
  width: 100px;
  background-color: #e5e5e5;
}

.chartHeader {
  opacity: 0.9;
  text-align: center;
  font-family: 'Lato';
  font-size: 20px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.4;
  letter-spacing: normal;
  color: rgba(56, 56, 56, 0.9);
}

.chartContainer {
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  padding-top: 40px;
}

.npsStats {
  display: flex;
  justify-content: space-evenly;
  width: 100%;
}

.npsStats span {
  padding-left: 30px;
  padding-right: 30px;
}

.npsStats .label {
  width: 29px;
  height: 12px;
  font-family: Lato;
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
}

.npsStats {
  font-size: 26px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
}

.npsScore {
  color: #068ccc;
}

.promoters {
  color: #21ba45;
}

.passives {
  color: #7f7f7f;
}

.detractors {
  color: #ee3824;
}

#npsTooltip {
  font-family: sans-serif;
  position: absolute;
  color :#383838;
  padding: .5rem;
  border-radius: 3px;
  border: solid 1px #e6e6e6;
  background-color: #f8f8f8;
  width: 255px;
}

#npsTooltip .date {
  font-size: 16.5px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.3;
  letter-spacing: normal;
  text-align: left;
}

#npsTooltip .npsTooltipScore {
  font-size: 18.5px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.3;
  letter-spacing: normal;
  text-align: left;
}

</style>
