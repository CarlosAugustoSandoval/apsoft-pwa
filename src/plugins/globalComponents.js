/**
 * Vuely Global Components
 */

// Inputs components

import CTexto from '@/components/globalComponents/CTexto'
import CPassword from '@/components/globalComponents/CPassword'
import CRadio from '@/components/globalComponents/CRadio'
import CSelectComplete from '@/components/globalComponents/CSelectComplete'
import BuscadorIps from '@/components/globalComponents/BuscadorIps'
import CIdentificacion from '@/components/globalComponents/CIdentificacion'
import CDate from '@/components/globalComponents/CDate'
import CTextArea from '@/components/globalComponents/CTextArea'
import CCheck from '@/components/globalComponents/CCheck'
import CNumber from '@/components/globalComponents/CNumber'
import CLocation from '@/components/globalComponents/CLocation'

import Loading from '@/modules/loading/components/Loading'
import TitleBar from '@/components/globalComponents/TitleBar'
import Snackbar from '@/modules/snackbar/components/Snackbar'
import FooterApp from '@/components/globalComponents/FooterApp'
import AlertInstall from '@/components/globalComponents/AlertInstall'

const GlobalComponents = {
  install (Vue) {
    Vue.component('CTexto', CTexto)
    Vue.component('CPassword', CPassword)
    Vue.component('CRadio', CRadio)
    Vue.component('CSelectComplete', CSelectComplete)
    Vue.component('BuscadorIps', BuscadorIps)
    Vue.component('CIdentificacion', CIdentificacion)
    Vue.component('CDate', CDate)
    Vue.component('CTextArea', CTextArea)
    Vue.component('CCheck', CCheck)
    Vue.component('CNumber', CNumber)
    Vue.component('CLocation', CLocation)

    Vue.component('Loading', Loading)
    Vue.component('Snackbar', Snackbar)
    Vue.component('TitleBar', TitleBar)
    Vue.component('FooterApp', FooterApp)
    Vue.component('AlertInstall', AlertInstall)
  }
}

export default GlobalComponents
