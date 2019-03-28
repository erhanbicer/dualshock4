import React, { PureComponent } from 'react';
import { View, ScrollView, StyleSheet, Animated, Dimensions, Platform } from 'react-native'; 
import { isIphoneX, deviceWidth } from './env';
import GradientBackgrounds from './GradientBackgrounds';
import Indicator from './Indicator';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    width: deviceWidth,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  indicator: {
    position: "absolute",
    bottom: isIphoneX ? 70 : 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});

export default class ProductCarousel extends PureComponent {
  scrollX = new Animated.Value(0);
  progress = new Animated.Value(0);

  onScroll = (e) => {
    this.progress.setValue(e.nativeEvent.contentOffset.x);
  }

  renderCards() {
    const { products, renderItem } = this.props;
    return products.map((item, index) => {
      return (
        <View key={`page-${index}`} style={styles.page}>
          {renderItem({ item, index, scrollX: this.scrollX })}
        </View>
      );
    });
  }

  render() {
    const { scrollEnabled, products } = this.props;

    return (
      <View style={StyleSheet.flatten(styles.container)}>
        <GradientBackgrounds
          scrollX={this.scrollX}
          colors={products.map(i => i.color)}
        />

        <View style={StyleSheet.flatten(styles.indicator)}>
          <Indicator
            count={products.length}
            progress={this.progress}
          />
        </View>

        <Animated.ScrollView
          ref={this.scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          decelerationRate="fast"
          scrollEventThrottle={1}
          onLayout={this.onLayout}
          scrollEnabled={scrollEnabled}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: { x: this.scrollX },
                },
              },
            ],
            {
              useNativeDriver: true,
              listener: this.onScroll,
            }
          )}
        >
          {this.renderCards()}
        </Animated.ScrollView>
      </View>
    );
  }
}