import React from 'react';
import { View, StyleSheet } from 'react-native';
import { verticalScale, height } from '../../themes/Metrics';
import LogoSvg from '../../svg/logo';
import BackgroundLogoSvg from '../../svg/backgroundLogo';
import BackgroundLogoSvgSmall from '../../svg/backgroundLogoSvgSmall';

const LogoContainer = () => {
  return (
    <>
      {height > 700 ? (
        <>
          <View style={styles.backgroundSvgContainer}>
            <BackgroundLogoSvg />
          </View>
          <View style={styles.logoContainerTall}>
            <LogoSvg />
          </View>
        </>
      ) : (
        <>
          <View style={styles.backgroundSvgContainer}>
            <BackgroundLogoSvgSmall />
          </View>
          <View style={styles.logoContainerShort}>
            <LogoSvg />
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  backgroundSvgContainer: {
    position: 'absolute',
    bottom: 0,
    zIndex: -1,
  },
  logoContainerTall: {
    alignSelf: 'center',
    marginTop: verticalScale(60),
    width: 189,
    height: 171,
    zIndex: 2,
  },
  logoContainerShort: {
    alignSelf: 'center',
    marginTop: verticalScale(60),
    width: 189,
    height: 171,
    zIndex: 2,
  },
});

export default LogoContainer;
