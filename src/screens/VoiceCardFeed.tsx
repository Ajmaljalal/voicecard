import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import VoiceCard from '../components/voicecard/VoiceCard';
import { useVoiceCards } from '../hooks/useVoiceCard';
import { useDispatch } from 'react-redux';
import { setVoiceCards } from '../store/voice-cards';
import VoiceRecorder from '../components/recorder/VoiceRecorder';
import { COLORS } from '../constants/Colors';
import { Text } from 'react-native';

const FeedScreen: React.FC = () => {
  const { data } = useVoiceCards();
  const dispatch = useDispatch();
  const swiperRef = useRef<Swiper<any>>(null);

  useEffect(() => {
    if (data) {
      dispatch(setVoiceCards(data));
    }
  }, [data, dispatch]);

  const onSwipedLeft = (cardIndex: number) => {
    console.log(`Swiped left on card index: ${cardIndex}`);
    // Handle swipe left action (e.g., dislike)
  };

  const onSwipedRight = (cardIndex: number) => {
    console.log(`Swiped right on card index: ${cardIndex}`);
    // Handle swipe right action (e.g., like)
  };

  return (
    <View style={styles.container}>
      {data && data.length > 0 ? (
        <Swiper
          ref={swiperRef}
          cards={data}
          renderCard={(card) => (
            <VoiceCard
              id={card.id}
              author={card.author}
              location={card.location}
              timestamp={card.timestamp}
              audioUrl={card.audioUrl}
              title={card.title}
              description={card.description}
            />
          )}
          onSwipedLeft={onSwipedLeft}
          onSwipedRight={onSwipedRight}
          cardIndex={0}
          backgroundColor={COLORS.background}
          stackSize={5}
          stackScale={0.8}
          stackSeparation={10}
          animateCardOpacity
          disableTopSwipe
          disableBottomSwipe
          verticalSwipe={false}
          containerStyle={styles.swiperContainer}
          cardStyle={styles.card}
        />
      ) : (
        <View style={styles.loader}>
          <Text>You have no voice cards</Text>
        </View>
      )}
      <VoiceRecorder />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'flex-end',
    padding: 0,
    margin: 0,
  },
  swiperContainer: {
    flex: 1,
    height: '100%',
    padding: 0,
    margin: 0,
  },
  card: {
    height: '75%',
    marginTop: 0,
    marginBottom: 0,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FeedScreen;