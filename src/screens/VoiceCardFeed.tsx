import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import VoiceCard from '../components/VoiceCard';
import VoiceRecorder from '../components/VoiceRecorder';
import { COLORS } from '../constants/Colors';
import { Text } from 'react-native';
import { useGetVoiceCardsQuery } from '../store/api/VoiceCardApi';
import LoadingSpinner from '../components/common/LoadingSpinner';

const FeedScreen: React.FC = () => {
  const { data, error, isLoading } = useGetVoiceCardsQuery();
  const swiperRef = useRef<Swiper<any>>(null);

  const onSwipedLeft = (cardIndex: number) => {
    console.log(`Swiped left on card index: ${cardIndex}`);
    // Handle swipe left action (e.g., dislike)
  };

  const onSwipedRight = (cardIndex: number) => {
    console.log(`Swiped right on card index: ${cardIndex}`);
    // Handle swipe right action (e.g., like)
  };

  if (isLoading) {
    return <LoadingSpinner />
  }

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
              createdAt={card.createdAt}
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
    height: 700,
  },
  swiperContainer: {
    flex: 1,
    padding: 0,
    margin: 0,
  },
  card: {
    height: 320,
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