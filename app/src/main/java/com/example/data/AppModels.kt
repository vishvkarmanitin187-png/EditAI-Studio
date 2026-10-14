package com.example.data

data class Project(
    val id: String,
    val title: String,
    val type: ProjectType,
    val lastModified: String,
    val durationOrSize: String,
    val isCloudBacked: Boolean = false
)

enum class ProjectType {
    VIDEO, PHOTO, THUMBNAIL, AUDIO
}

data class MusicTrack(
    val id: String,
    val title: String,
    val category: String,
    val duration: String,
    val artist: String
)

data class Template(
    val id: String,
    val title: String,
    val category: String,
    val aspectRatio: String,
    val clipsCount: Int = 3,
    val duration: String = "9s",
    val musicName: String = "Trending Beat Sync #1",
    val usageCount: String = "1.2M uses",
    val author: String = "EditAI Creator"
)

data class UserProfile(
    val name: String = "Guest Creator",
    val email: String = "guest@editai.studio",
    val isPro: Boolean = false,
    val aiCredits: Int = 50,
    val rewardedAdsWatched: Int = 0,
    val isGoogleLoggedIn: Boolean = false
)
