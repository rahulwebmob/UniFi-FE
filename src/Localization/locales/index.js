import applicationEn from './en/application.json'
import educationEn from './en/education.json'
import modulesEn from './en/modules.json'
import applicationNe from './ne/application.json'
import educationNe from './ne/education.json'
import modulesNe from './ne/modules.json'

const locales = {
  resources: {
    en: {
      application: applicationEn,
      modules: modulesEn,
      education: educationEn,
    },
    ne: {
      application: applicationNe,
      modules: modulesNe,
      education: educationNe,
    },
  },
}

export default locales
